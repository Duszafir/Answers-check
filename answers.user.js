// ==UserScript==
// @name         Answer Check with Settings Menu Toggle
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Ver las respuestas con el botón '+' y abrir el menú de configuración con la tecla '|'
// @author       Uriel Szafir
// @include      *://campus.ort.edu.ar/*/formulario/*
// @include      *://campus.ort.edu.ar/formulario/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let rowPag = Object.values(window.rowPag || {})[0];
    let rgbOn = true;

    function rotateRgbColor() {
        let r = 255, g = 0, b = 0;
        let step = 5;

        if (rgbOn) {
            document.querySelectorAll('#question-display').forEach(el => {
                el.style.borderColor = 'rgb(255, 0, 0)';
            });
        }

        document.querySelectorAll('#question-display').forEach(el => {
            el.style.transition = 'border-color 0.1s linear';
        });

        setInterval(() => {
            if (!rgbOn) {
                document.querySelectorAll('#question-display').forEach(el => {
                    el.style.borderColor = '#000000';
                });
                return;
            }

            if (r === 255 && g < 255 && b === 0) g += step;
            else if (g === 255 && r > 0 && b === 0) r -= step;
            else if (g === 255 && b < 255 && r === 0) b += step;
            else if (b === 255 && g > 0 && r === 0) g -= step;
            else if (b === 255 && r < 255 && g === 0) r += step;
            else if (r === 255 && b > 0 && g === 0) b -= step;

            document.querySelectorAll('#question-display').forEach(el => {
                el.style.borderColor = `rgb(${r}, ${g}, ${b})`;
            });
        }, 10);
    }


    if (rowPag && rowPag.questions) {
        const questions = rowPag.questions;

        // Menú de respuestas con el botón "+"
        window.addEventListener('keydown', function (event) {
            if (event.key === '+') {
                const existingDiv = document.getElementById('question-display');
                if (existingDiv) {
                    existingDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    existingDiv.style.opacity = '0';
                    existingDiv.style.transform = 'translateX(100%)';

                    setTimeout(() => {
                        existingDiv.remove();
                    }, 500);
                    return;
                }

                const mainContainer = document.createElement('div');
                mainContainer.id = 'question-display';
                mainContainer.style.position = 'fixed';
                mainContainer.style.top = '10px';
                mainContainer.style.left = '-300px';
                mainContainer.style.width = '300px';
                mainContainer.style.height = '90vh';
                mainContainer.style.backgroundColor = '#1a1a1a';
                mainContainer.style.color = 'white';
                mainContainer.style.padding = '15px';
                mainContainer.style.zIndex = '9999';
                mainContainer.style.overflowY = 'auto';
                mainContainer.style.borderRadius = '10px';
                mainContainer.style.border = '2px solid rgb(255, 0, 0)';
                mainContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

                mainContainer.style.scrollbarWidth = 'thin';
                mainContainer.style.scrollbarColor = '#ff6f61 #333';

                mainContainer.style.opacity = '0';
                mainContainer.style.transform = 'translateX(-100%)';
                mainContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                const style = document.createElement('style');
                style.textContent = `
                    #mainContainer::-webkit-scrollbar {
                        width: 8px; /* Ancho de la barra */
                    }
                    #mainContainer::-webkit-scrollbar-track {
                        background: #333; /* Color del track */
                        border-radius: 30px; /* Bordes redondeados */
                    }
                    #mainContainer::-webkit-scrollbar-thumb {
                        background: #ff6f61; /* Color del "thumb" */
                        border-radius: 30px; /* Bordes redondeados */
                    }
                    #mainContainer::-webkit-scrollbar-thumb:hover {
                        background: #e5503c; /* Color del "thumb" al pasar el cursor */
                    }
                `;
                document.head.appendChild(style);

                Object.values(questions)
                    .sort((a, b) => a.order - b.order)
                    .forEach((question) => {
                        const questionDiv = document.createElement('div');
                        questionDiv.style.marginBottom = '15px';
                        questionDiv.style.fontSize = '14px';
                        questionDiv.style.color = '#ff6f61';
                        questionDiv.textContent = `Pregunta: ${question.order || 'No hay respuestas cargadas'}`;

                        if (question.options && question.options.length > 0) {
                            question.options.forEach((option, index) => {
                                const optionDiv = document.createElement('div');
                                let correctStatus = '';

                                if (option.correct === true || option.correct === 'true') {
                                    correctStatus = 'Correcta';
                                } else if (option.correct === false || option.correct === 'false') {
                                    correctStatus = 'Incorrecta';
                                } else if (option.correct === null) {
                                    correctStatus = 'No encontrado';
                                } else if (option.correct === undefined) {
                                    correctStatus = 'No hay respuestas cargadas';
                                } else {
                                    correctStatus = `Respuesta: ${option.correct}`;
                                }

                                optionDiv.style.paddingLeft = '10px';
                                optionDiv.style.fontSize = '12px';
                                optionDiv.style.color = '#a3a3a3';
                                optionDiv.textContent = `  Opción ${index + 1}: ${correctStatus}`;
                                questionDiv.appendChild(optionDiv);
                            });
                        } else {
                            const noOptionsDiv = document.createElement('div');
                            noOptionsDiv.style.paddingLeft = '10px';
                            noOptionsDiv.style.fontSize = '12px';
                            noOptionsDiv.style.color = '#a3a3a3';
                            noOptionsDiv.textContent = 'No hay respuestas cargadas';
                            questionDiv.appendChild(noOptionsDiv);
                        }

                        mainContainer.appendChild(questionDiv);
                    });

                document.body.appendChild(mainContainer);

                requestAnimationFrame(() => {
                    mainContainer.style.opacity = '1';
                    mainContainer.style.transform = 'translateX(310px)';
                });

                if (rgbOn) rotateRgbColor();
            }

            if (event.key === '|') {
                const settingsMenu = document.getElementById('settings-menu');
                if (settingsMenu) {
                    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
                }
            }
        });

        const newSettingsMenu = document.createElement('div');
        newSettingsMenu.id = 'settings-menu';
        newSettingsMenu.style.position = 'fixed';
        newSettingsMenu.style.top = '50%';
        newSettingsMenu.style.left = '50%';
        newSettingsMenu.style.transform = 'translate(-50%, -50%)';
        newSettingsMenu.style.backgroundColor = '#2c2c2c';
        newSettingsMenu.style.padding = '20px';
        newSettingsMenu.style.borderRadius = '10px';
        newSettingsMenu.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
        newSettingsMenu.style.display = 'none';
        newSettingsMenu.style.zIndex = '10000';

        const title = document.createElement('div');
        title.textContent = 'Menú de configuraciones';
        title.style.fontSize = '20px';
        title.style.color = 'white';
        title.style.textAlign = 'center';
        newSettingsMenu.appendChild(title);

        const rgbLabel = document.createElement('div');
        rgbLabel.textContent = 'Luces RGB';
        rgbLabel.style.marginBottom = '10px';
        rgbLabel.style.color = 'white';

        const rgbButtonContainer = document.createElement('div');
        rgbButtonContainer.style.display = 'flex';
        rgbButtonContainer.style.justifyContent = 'space-between';
        rgbButtonContainer.style.alignItems = 'center';

        const rgbButton = document.createElement('div');
        rgbButton.style.position = 'relative';
        rgbButton.style.width = '50px';
        rgbButton.style.height = '25px';
        rgbButton.style.backgroundColor = rgbOn ? 'green' : 'grey';
        rgbButton.style.borderRadius = '50px';
        rgbButton.style.cursor = 'pointer';
        rgbButton.style.transition = 'background-color 0.3s ease';

        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.top = '2px';
        circle.style.left = rgbOn ? 'calc(100% - 23px)' : '2px';
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'white';
        circle.style.transition = 'left 0.3s ease';

        rgbButton.appendChild(circle);
        rgbButton.onclick = function () {
            rgbOn = !rgbOn;
            rgbButton.style.backgroundColor = rgbOn ? 'green' : 'grey';
            circle.style.left = rgbOn ? 'calc(100% - 23px)' : '2px';
            rotateRgbColor();
        };

        rgbButtonContainer.appendChild(rgbLabel);
        rgbButtonContainer.appendChild(rgbButton);
        newSettingsMenu.appendChild(rgbButtonContainer);

        document.body.appendChild(newSettingsMenu);

    }

})();
