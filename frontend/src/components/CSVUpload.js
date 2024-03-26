import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function CSVUpload() {
    const [file, setFile] = useState(null);
    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        setSelectedLabels([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send file to backend to parse and get labels
            const response = await fetch('http://localhost:3000/api/v1/users/upload', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const { labels } = await response.json();
                setLabels(labels);
            } else {
                console.error('Error parsing file');
            }
        } catch (error) {
            console.error('Client error:', error);
        }
    };

    const handleLabelSelection = (event) => {
        const selectedLabel = event.target.value;
        if (!selectedLabels.includes(selectedLabel)) {
            setSelectedLabels([...selectedLabels, selectedLabel]);
        }
    };

    const handleGenerateChart = async () => {
        try {
            // Send selected labels to backend to generate chart
            const response = await fetch('http://localhost:3000/api/v1/users/generateChart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedLabels })
            });
            if (response.ok) {
                const { url } = await response.json();
                setImageUrl(url);
                // setSelectedLabels([]);
            } else {
                console.error('Error generating chart');
            }
        } catch (error) {
            console.error('Client error:', error);
        }
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload CSV File:</Form.Label>
                    <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Parse File
                </Button>
            </Form>

            {labels.length > 0 && (
                <Form>
                    <Form.Group controlId="formLabels" className="mb-3">
                        <Form.Label>Select Labels for Bar Graph:</Form.Label>
                        <Form.Control as="select" multiple onChange={handleLabelSelection}>
                            {labels.map((label, index) => (
                                <option key={index}>{label}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" onClick={handleGenerateChart}>
                        Generate Bar Graph
                    </Button>
                </Form>
            )}

            {imageUrl && (
                <div>
                    <h3>Chart Image</h3>
                    <img src={imageUrl} alt="Chart" />
                </div>
            )}
        </Container>
    );
}

export default CSVUpload;
