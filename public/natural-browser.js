const trainingData = []
const handleSubmit = (e) => {
    console.log('asd')
    const calculateCard = document.getElementById('calculate-card');
    calculateCard.classList.add('translate');
    let petalLength = document.getElementById('petalLength').value.replace(/[,.]/g, '');
    let petalWidth = document.getElementById('petalWidth').value.replace(/[,.]/g, '');
    let sepalLength = document.getElementById('sepalLength').value.replace(/[,.]/g, '');
    let sepalWidth = document.getElementById('sepalWidth').value.replace(/[,.]/g, '');
    const inputFeatures = `${sepalLength} ${sepalWidth} ${petalLength} ${petalWidth}`;
    const body = {
        input: inputFeatures
    }

    fetch('/calculate', {
        method: 'POST', // Use POST method
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) // Convert data to JSON format
    })
        .then(response => alert(response.data))
        .catch(error => {
            console.error('An error occurred:', error);
        });
};
document.addEventListener('DOMContentLoaded', () => {
    handleSubmit()
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'Iris.csv', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const csvData = xhr.responseText;
            const lines = csvData.trim().split('\n');
            lines.forEach((line) => {
                if (line.trim() !== '') {
                    const parts = line.split(',');
                    const keys = `${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]}`;
                    const values = parts[5];
                    trainingData.push({ keys, values });
                }
            })
        }
        trainingData.forEach(data => {
            const cleanText = data.keys.replace(/[,.]/g, '');
            classifier.addDocument(cleanText, data.values);
        });
    };
    console.log(trainingData)
    xhr.send();
});

const button = document.getElementById('button');

