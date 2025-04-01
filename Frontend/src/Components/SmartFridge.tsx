import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SmartFridge.css'

const SmartFridge: React.FC = () => {
    return (
        <div>
            <div style={{ border: '1px solid #333', padding: '16px', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>Smart Fridge</h2>
                {['Meat', 'Diary', 'Vegetable'].map((category) => (
                    <div key={category} style={{ marginBottom: '16px' }}>
                        <h3 style={{ color: '#555' }}>{category}</h3>
                        <hr style={{ borderColor: '#ddd' }} />
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {['Item 1', 'Item 2', 'Item 3'].map((item, index) => (
                                <li key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#d9534f', marginRight: '8px' }}></div>
                                    <span style={{ color: '#333' }}>{item}</span>
                                    <span style={{ color: '#777' }}>{index === 0 ? '0.5 lb' : index === 1 ? '2 lb' : '1 lb'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SmartFridge