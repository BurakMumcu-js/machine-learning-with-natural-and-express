const express = require('express');
const app = express();
const port = 3000;

const XLSX = require('xlsx');
const fs = require('fs');
const natural = require('natural')
const classifier = new natural.BayesClassifier();

const excelFilePath = 'Iris.csv';

const workbook = XLSX.readFile(excelFilePath);

const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];


let rowCount = 0;
for (const cell in worksheet) {
    if (cell.startsWith('A')) {
        rowCount++;
    }
}

fs.readFile(excelFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Dosya okunurken bir hata oluştu:', err);
        return;
    }

    // Satırları diziye ayır
    const lines = data.split('\n');

    const trainingData = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() !== '') {
            const parts = line.split(',');
            const keys = `${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]}`;
            const values = parts[5];
            trainingData.push({ keys, values });
        }
    }

    trainingData.forEach(data => {
        const cleanText = data.keys.replace(/[,.]/g, '');
        classifier.addDocument(cleanText, data.values);
    });
    classifier.train();
});


app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('index');
});


app.post('/calculate', (req, res) => {
    try {
        const result = classifier.classify(req.body.input);
        classifier.train();
        res.json({result})
    }
    catch(error) {
        res.status(500).json({ message: 'Errored out'})
    }

});

app.listen(port, () => {
    console.log('server listening on port', port)
})