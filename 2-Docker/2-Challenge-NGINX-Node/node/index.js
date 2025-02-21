const express = require('express');
const app = express();

const port = 3000;
const localhost = '0.0.0.0';

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const mysql = require('mysql2')
const connection = mysql.createConnection(config)

function getNomeAleatorio() {
    const nomes = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Juliana', 'Gustavo', 'Camila', 'Fernando', 'Letícia'];
    const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
    return nomeAleatorio;
}

// Criar tabela se não existir
const createTable = `CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)`;

connection.query(createTable, (err) => {
    if (err) throw err;
    console.log('Tabela criada ou já existente');
    
    // Inserir nome aleatório
    const sqlInsert = `INSERT INTO people(name) VALUES(?)`;
    connection.query(sqlInsert, [getNomeAleatorio()], (err) => {
        if (err) throw err;
        console.log('Nome inserido com sucesso');
    });
});

const getListaNomes = (callback) => {
    const sqlSelect = `SELECT name FROM people`;
    connection.query(sqlSelect, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results.map(row => row.name));
    });
};

app.get('/', (req, res) => {
    getListaNomes((err, nomes) => {
        if (err) {
            return res.status(500).send('Erro ao buscar dados.');
        }

        const listaNomesHtml = nomes.map(name => `<li>${name}</li>`).join('');
        res.send(`<h1>Full Cycle Rocks!</h1><ul>${listaNomesHtml}</ul>`);
    });
});

app.listen(port, localhost, () => {
    console.log(`Rodando na porta http://${localhost}:${port}`);
});