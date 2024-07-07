// Definición de la clase Sensor
class Sensor {
    constructor(id, name, type, value, unit, updated_at) {
        this.id = id;
        this.name = name;
        this.type = type;
        this._value = value; // Se usa _value para el valor interno
        this.unit = unit;
        this.updated_at = updated_at;
    }

    // Getter para el valor del sensor
    get value() {
        return this._value;
    }

    // Setter para actualizar el valor del sensor y la fecha de actualización
    set updateValue(newValue) {
        this._value = newValue;
        this.updated_at = new Date().toISOString();
    }
}

// Importamos la clase Sensor
import Sensor from './sensors.js';

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    // Método para cargar los sensores desde un archivo JSON
    async loadSensors(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.sensors = data.map(sensorData => {
                // Validación del tipo permitido
                if (sensorData.type !== 'temperature' && sensorData.type !== 'humidity' && sensorData.type !== 'pressure') {
                    throw new Error(`Tipo de sensor desconocido: ${sensorData.type}`);
                }
                // Creamos instancias de Sensor a partir de los datos del JSON
                return new Sensor(
                    sensorData.id,
                    sensorData.name,
                    sensorData.type,
                    sensorData.value,
                    sensorData.unit,
                    sensorData.updated_at
                );
            });
            this.render(); // Llamamos a render para mostrar los sensores en la página
        } catch (error) {
            console.error('Error al cargar los sensores:', error.message);
        }
    }

    //SensorManager 
    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperature": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humidity": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "pressure": // Rango de 960 a 1040 
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}


