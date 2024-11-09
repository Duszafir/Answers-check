// ==UserScript==
// @name         Answer Check
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Ver las respuestas del formulario
// @author       Uriel Szafir
// @match        https://campus.ort.edu.ar/*/formulario/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let rowPag = Object.values(window.rowPag || {})[0]; // importante esta línea!! si no no funca

    if (rowPag && rowPag.questions) {
        const questions = rowPag.questions;

        window.addEventListener('keydown', function (event) {
            if (event.key === '+') {
                const existingDiv = document.getElementById('question-display');
                if (existingDiv) {
                    // Animación de salida (se mueve hacia la izquierda)
                    existingDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    existingDiv.style.opacity = '0';
                    existingDiv.style.transform = 'translateX(-100%)';

                    // Esperamos a que la animación termine antes de eliminar el div
                    setTimeout(() => {
                        existingDiv.remove();
                    }, 500); // Duración de la animación
                    return;
                }

                const mainContainer = document.createElement('div');
                mainContainer.id = 'question-display';
                mainContainer.style.position = 'fixed';
                mainContainer.style.top = '10px';
                mainContainer.style.left = '10px';
                mainContainer.style.backgroundColor = '#fff';
                mainContainer.style.border = '1px solid #ccc';
                mainContainer.style.padding = '10px';
                mainContainer.style.zIndex = '9999';
                mainContainer.style.maxHeight = '90vh';
                mainContainer.style.overflowY = 'auto';
                mainContainer.style.display = 'block';

                // Estilos iniciales para la animación
                mainContainer.style.opacity = '0';
                mainContainer.style.transform = 'translateX(-100%)';
                mainContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

                Object.values(questions).forEach((question) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.style.marginBottom = '10px';
                    questionDiv.style.fontSize = '12px';
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
                                correctStatus = `Valor desconocido: ${option.correct}`;
                            }

                            optionDiv.textContent = `  Opción ${index + 1}: ${correctStatus}`;
                            questionDiv.appendChild(optionDiv);
                        });
                    } else {
                        const noOptionsDiv = document.createElement('div');
                        noOptionsDiv.textContent = 'No hay respuestas cargadas';
                        questionDiv.appendChild(noOptionsDiv);
                    }

                    mainContainer.appendChild(questionDiv);
                });

                const adjustLayout = () => {
                    const totalHeight = mainContainer.scrollHeight;
                    if (totalHeight > window.innerHeight) {
                        mainContainer.style.display = 'flex';
                        mainContainer.style.flexWrap = 'wrap';
                        mainContainer.style.gap = '10px';
                    } else {
                        mainContainer.style.display = 'block';
                    }
                };

                document.body.appendChild(mainContainer);

                // Forzar el reflujo para que la animación se active
                requestAnimationFrame(() => {
                    mainContainer.style.opacity = '1';
                    mainContainer.style.transform = 'translateX(0)';
                });

                adjustLayout();

                window.addEventListener('resize', adjustLayout);
            }
        });
    } else {
        console.log('No se encontró información de preguntas.');
    }
})();
