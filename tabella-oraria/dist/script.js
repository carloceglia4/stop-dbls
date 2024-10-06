function calculate() {
    const totalData = parseFloat(document.getElementById('totalData').value);
    const tbody = document.querySelector('#scheduleTable tbody');
    
    // Pulire la tabella esistente
    tbody.innerHTML = '';

    if (!isNaN(totalData) && totalData > 0) {
        const totalWorkHours = 7.67; // 7 ore e 40 minuti di lavoro effettivo
        const pauseMinutes = 30; // Mezz'ora di pausa
        const stableHours = 2; // Prime 3 ore con produttività stabile al 110%
        const remainingHours = totalWorkHours - stableHours; // Ore rimanenti
        let remainingData = totalData; // Quantità di lavoro residua
        const initialProductivityFactor = 1.1; // Produttività iniziale al 110%
        const finalProductivityFactor = 0.85; // Produttività al 80% alla fine
        const fatigueIncreaseRate = (initialProductivityFactor - finalProductivityFactor) / (remainingHours - 1); // Tasso di diminuzione della produttività

        // Orario di partenza
        const startHour = 11; // 11:20
        const startMinutes = 15;

        let pauseTaken = false;

        // Calcolo della quantità totale di lavoro da svolgere ogni ora
        for (let hour = 1; hour < totalWorkHours + (pauseMinutes / 60); hour++) {
            let row = tbody.insertRow();
            let cellHour = row.insertCell(0);
            let cellData = row.insertCell(1);

            // Determinazione dell'orario
            let currentHour = startHour + Math.floor((startMinutes + hour * 60) / 60);
            let currentMinute = (startMinutes + hour * 60) % 60;

            // Pausa: a metà del lavoro, fermiamo per 30 minuti
            if (!pauseTaken && hour >= (totalWorkHours / 2)) {
                currentMinute += pauseMinutes;
                if (currentMinute >= 60) {
                    currentHour++;
                    currentMinute -= 60;
                }
                pauseTaken = true;
            }

            cellHour.textContent = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

            // Saltiamo il calcolo del lavoro durante la pausa
            if (pauseTaken && hour === Math.floor(totalWorkHours / 2)) {
                cellData.textContent = 'Pausa';
                row.classList.add('pause');
                continue;
            }

            // Produttività attuale in funzione delle ore
            let currentProductivityFactor;
            if (hour < stableHours) {
                currentProductivityFactor = initialProductivityFactor;
            } else {
                const fatigueHourIndex = hour - stableHours;
                currentProductivityFactor = initialProductivityFactor - fatigueIncreaseRate * fatigueHourIndex;
            }

            // Calcolo del lavoro per questa ora
            const productivityForThisHour = (totalData / totalWorkHours) * currentProductivityFactor;
            remainingData -= productivityForThisHour;

            // Aggiorna la cella con il dato residuo
            cellData.textContent = remainingData > 0 ? remainingData.toFixed(2) : '0';

            // Se il lavoro residuo è zero o meno, interrompi il ciclo
            if (remainingData <= 0) {
                break;
            }
        }

        // Controlla se il valore residuo è zero
        if (remainingData > 0) {
            alert('Il lavoro non è completato entro le 19:15. Assicurati che il dato iniziale sia sufficiente.');
        }
    } else {
        alert('Per favore, inserisci un valore valido.');
    }
}