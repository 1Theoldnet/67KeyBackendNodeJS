const express = require('express')
const cors = require("cors")
const app = express()
app.use(cors())

const users = [
    {
        name: "Mavludin",
        password: "12345",
        money: 0
    }
]

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/user/register', (req, res) => {
    const { name, password } = req.body

    users.push({ name, password, money: 0 })

    res.json({ message: "Пользователь успешло создан!" })
})

app.post('/user/login', (req, res) => {
    const { name, password } = req.body

    users.push({ name, password, money: 0 })

    res.json({ message: "Пользователь успешло создан!" })
})

app.get('/user/:index', (req, res) => {
    const user = users[parseInt(req.params.index)]

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ message: "Пользователь не найден!" })
    }
})

app.put('/user/edit/:index', (req, res) => {
    const { name, password } = req.body
    const user = users[parseInt(req.params.index)]

    if (user) {
        users[parseInt(req.params.index)] = { name, password, money: user.money }
        res.json({ message: "Пользователь успешно отредактирован!" })
    } else {
        res.status(404).json({ message: "Пользователь не найден!" })
    }
})

app.delete('/user/:index', (req, res) => {
    const user = users[parseInt(req.params.index)]

    if (user) {
        users.splice(parseInt(req.params.index), 1)
        res.json({ message: "Пользователь успешло удалён!" })
    } else {
        res.status(404).json({ message: "Пользователь не найден!" })
    }
})

app.listen(5000, () => {
    console.log("Server is running with Socket.IO!");
})
