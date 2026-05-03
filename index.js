const express = require('express')
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

const users = [
    {
        avatarUrl: '',
        name: 'Mavludin',
        password: '12345',
        activedPromoCodes: [],
        balance: 0,
        createdAt: '02.05.2026, 14:55:11'
    }
]

app.get('/users', (req, res) => res.json(users))

app.post('/user/register', (req, res) => {
    const { avatarUrl, name, password, createdAt } = req.body

    const isHaveUser = users.find(user => user.name === name && user.password === password)

    if(isHaveUser) {
        res.json({ message: "Такой пользователь уже существует!" })
    } else {
        users.push({ avatarUrl, name, password, activedPromoCodes: [], balance: 0, createdAt })

        res.json({ message: "Пользователь успешло создан!" })
    }
})

app.post('/user/login', (req, res) => {
    const { name, password } = req.body

    const isHaveUser = users.find(user => user.name === name && user.password === password)

    if(isHaveUser) {
        res.json({ userIndex: users.findIndex(user => user.name === name && user.password === password) })
    } else {
        res.json({ message: "Такого пользователя не существует!" })
    }
})

app.get('/user/:index', (req, res) => {
    const user = users[parseInt(req.params.index)]

    if (user) {
        res.json(user)
    } else {
        res.json({ message: "Пользователь не найден!" })
    }
})

app.put('/user/edit/:index', (req, res) => {
    const { avatarUrl, name, password, balance } = req.body
    const user = users[parseInt(req.params.index)]

    if (user) {
        // Сохраняем старый баланс если новый не передан
        const newBalance = balance !== undefined ? balance : user.balance
        
        users[parseInt(req.params.index)] = { 
            avatarUrl: avatarUrl || user.avatarUrl, 
            name: name || user.name, 
            password: password || user.password, 
            balance: newBalance,
            activedPromoCodes: user.activedPromoCodes,
            createdAt: user.createdAt
        }
        res.json({ 
            message: "Пользователь успешно отредактирован!",
            balance: newBalance
        })
    } else {
        res.json({ message: "Пользователь не найден!" })
    }
})

app.post('/user/activePromoCode/:index', (req, res) => {
    const { promoCode } = req.body
    const user = users[parseInt(req.params.index)]

    if (!user) {
        return res.json({ message: "Пользователь не найден!" })
    }

    if (user.activedPromoCodes.includes(promoCode)) {
        return res.json({ message: "Этот промокод уже был активирован!" })
    }

    const promoCodesBonus = {
        'BONUS': 100,
        'FRIEND50': 50,
        'SPECIAL500': 500,
        'GLASS2024': 200,
        'STARTER': 75,
        'VERYBIGBONUSBYCREATOR': 1000000000000000
    }

    const bonus = promoCodesBonus[promoCode]
    
    if (!bonus) {
        return res.json({ message: "Неверный промокод!" })
    }

    user.activedPromoCodes.push(promoCode)
    user.balance += bonus

    res.json({ 
        message: `Промокод "${promoCode}" успешно активирован! Получено ${bonus} монет.`,
        balance: user.balance,
        activedPromoCodes: user.activedPromoCodes
    })
})

app.delete('/user/:index', (req, res) => {
    const user = users[parseInt(req.params.index)]

    if (user) {
        users.splice(parseInt(req.params.index), 1)
        res.json({ message: "Пользователь успешло удалён!" })
    } else {
        res.json({ message: "Пользователь не найден!" })
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Что-то пошло не так на сервере!" })
})

app.listen(5000, () => {
    console.log("Server is running with Socket.IO!");
})
