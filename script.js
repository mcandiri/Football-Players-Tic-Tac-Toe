 // Defining the list to store teams loaded from the CSV file.
let teamsList = [];

// Ensuring the script runs after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    loadTeamsFromCSV('dataset.csv');
});

/**
 * Fetches and processes a CSV file to load teams into dropdowns.
 * @param {string} filePath The path to the CSV file containing team data.
 */
async function loadTeamsFromCSV(filePath) {
    try {
        const response = await fetch(filePath);
        const text = await response.text();
        teamsList = parseCSV(text);
        populateDropdown('dropdown1', teamsList);
        populateDropdown('dropdown2', teamsList);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

/**
 * Parses the CSV data to extract unique teams, sorting them alphabetically.
 * @param {string} csvData The raw CSV data as a string.
 * @returns {Array} An array of unique, sorted team names.
 */
function parseCSV(csvData) {
    return [...new Set(csvData.split('\n').slice(1).flatMap(line => line.split(',').slice(1).map(team => team.trim())))].sort();
}

/**
 * Populates a dropdown element with options based on the provided teams array.
 * @param {string} dropdownId The ID of the dropdown to populate.
 * @param {Array} teams An array of team names to use as options.
 */
function populateDropdown(dropdownId, teams) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = teams.map(team => `<option value="${team}">${team}</option>`).join('');
}

/**
 * Filters dropdown options based on a search term.
 * @param {string} dropdownId The ID of the dropdown to filter.
 * @param {string} searchTerm The term to filter options by.
 */
function filterOptions(dropdownId, searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredTeams = teamsList.filter(team => team.toLowerCase().includes(lowerCaseSearchTerm));
    populateDropdown(dropdownId, filteredTeams);
}

/**
 * Displays common players between two selected teams.
 */
async function showCommonPlayers() {
    const team1 = document.getElementById('dropdown1').value;
    const team2 = document.getElementById('dropdown2').value;
    const textarea = document.getElementById("commonPlayers");
    textarea.value = '';

    try {
        const response = await fetch('dataset.csv');
        const text = await response.text();
        const commonPlayers = distinctValuesForColumn(text, team1, team2);
        
        textarea.value = commonPlayers.join("\n");
    } catch (error) {
        console.error('Failed to fetch or process CSV:', error);
    }
}

/**
 * Finds the common players between two teams.
 * @param {string} csvData The CSV data as a string.
 * @param {string} teamName1 The name of the first team.
 * @param {string} teamName2 The name of the second team.
 * @returns {Array} An array containing the names of common players.
 */
function distinctValuesForColumn(csvData, teamName1, teamName2) {
    const lines = csvData.split('\n').slice(1);
    const team1Players = new Set();
    const team2Players = new Set();

    lines.forEach(line => {
        const [player, leftTeam, joinedTeam] = line.split(',').map(value => value.trim());
        if (leftTeam === teamName1 || joinedTeam === teamName1) team1Players.add(player);
        if (leftTeam === teamName2 || joinedTeam === teamName2) team2Players.add(player);
    });

    return [...intersection(team1Players, team2Players)];
}

/**
 * Calculates the intersection of two sets.
 * @param {Set} setA The first set.
 * @param {Set} setB The second set.
 * @returns {Set} A new set containing elements that exist in both setA and setB.
 */
function intersection(setA, setB) {
    return new Set([...setA].filter(item => setB.has(item)));
}
