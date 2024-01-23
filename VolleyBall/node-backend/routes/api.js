const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const { Console } = require('console');
const router = express.Router();

const dbPath = path.join(__dirname, '../data/VolleyBallDB.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

// Funktion zur Ausführung einer SQL-Abfrage und Senden der Ergebnisse
function queryTable(res, sql) {
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "Erfolg",
            data: rows
        });
    });
}

router.get('/players', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 1000;
    let offset = (page - 1) * limit;
    let params = [];

    let filters = [];
    if (req.query.No) {
        filters.push("No LIKE ?");
        params.push(`%${req.query.No}%`);
    }
    if (req.query.FederationCode) {
        filters.push("FederationCode LIKE ?");
        params.push(`%${req.query.FederationCode}%`);
    }
    if (req.query.Name) {
        filters.push("FirstName LIKE ?");
        params.push(`%${req.query.Name}%`);
    }

    if (req.query.LastName) {
        filters.push("LastName LIKE ?");
        params.push(`%${req.query.LastName}%`);
    }
    if (req.query.Gender) {
        filters.push("Gender LIKE ?");
        params.push(`%${req.query.Gender}%`);
    }
    if (req.query.PlaysBeach) {
        filters.push("PlaysBeach LIKE ?");
        params.push(`%${req.query.PlaysBeach}%`);
    }
    if (req.query.PlaysVolley) {
        filters.push("PlaysVolley LIKE ?");
        params.push(`%${req.query.PlaysVolley}%`);
    }
    if (req.query.TeamName) {
        filters.push("TeamName LIKE ?");
        params.push(`%${req.query.TeamName}%`);
    }


    let whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const sql = `SELECT * FROM Players ${whereClause} LIMIT ? OFFSET ? `;
    params.push(limit, offset);

    console.log("Ausgeführte SQL-Abfrage: ", sql); // Log der SQL-Abfrage
    console.log("Verwendete Parameter: ", params); // Log der verwendeten Parameter


    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        let debugQuery = sql;
        params.forEach(param => {
            debugQuery = debugQuery.replace('?', `'${param}'`);
        });

        res.json({
            message: {
                array : [whereClause, sql, filters,req.query.FederationCode,"Test"],
                query: sql,
                debug: debugQuery,
                param: params
            },
            data: rows,
            currentPage: page
        });
    });
});



// Route, um alle BeachTeams abzurufen
router.get('/teams', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 1000;
    let offset = (page - 1) * limit;
    let params = [];

    let filters = [];

    if (req.query.NoPlayer1) {
        filters.push("NoPlayer1 LIKE ?");
        params.push(`%${req.query.NoPlayer1}%`);
    }
    if (req.query.NoPlayer2) {
        filters.push("NoPlayer2 LIKE ?");
        params.push(`%${req.query.NoPlayer2}%`);
    }
    if (req.query.Name) {
        filters.push("Name LIKE ?");
        params.push(`%${req.query.Name}%`);
    }


    if (req.query.Rank) {
        filters.push("Rank LIKE ?");
        params.push(`%${req.query.Rank}%`);
    }
    if (req.query.EarnedPointsTeam) {
        filters.push("EarnedPointsTeam LIKE ?");
        params.push(`%${req.query.EarnedPointsTeam}%`);
    }
    if (req.query.EarningsTeam) {
        filters.push("EarningsTeam LIKE ?");
        params.push(`%${req.query.EarningsTeam}%`);
    }
    if (req.query.No) {
        filters.push("No LIKE ?");
        params.push(`%${req.query.No}%`);
    }


    let whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const sql = `SELECT * FROM beachTeams ${whereClause} LIMIT ? OFFSET ? `;
    params.push(limit, offset);
    console.log("Ausgeführte SQL-Abfrage: ", sql); // Log der SQL-Abfrage
    console.log("Verwendete Parameter: ", params); // Log der verwendeten Parameter
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        let debugQuery = sql;
        params.forEach(param => {
            debugQuery = debugQuery.replace('?', `'${param}'`);
        });
        res.json({
            message: {
                array : [whereClause, sql, filters,"Test"],
                query: sql,
                debug: debugQuery,
                param: params
            },
            data: rows,
            currentPage: page
        });
    });
});

// Route, um alle VolleyballTournaments abzurufen
router.get('/volleyballtournaments', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 1000;
    let offset = (page - 1) * limit;
    let params = [];

    let filters = [];

    if (req.query.Code) {
        filters.push("Code LIKE ?");
        params.push(`%${req.query.Code}%`);
    }
    if (req.query.Name) {
        filters.push("Name LIKE ?");
        params.push(`%${req.query.Name}%`);
    }

    if (req.query.StartDate) {
        filters.push("StartDate LIKE ?");
        params.push(`%${req.query.StartDate}%`);
    }
    if (req.query.EndDate) {
        filters.push("EndDate LIKE ?");
        params.push(`%${req.query.EndDate}%`);
    }
    if (req.query.No) {
        filters.push("No LIKE ?");
        params.push(`%${req.query.No}%`);
    }


    let whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const sql = `SELECT * FROM VolleyballTournaments ${whereClause} LIMIT ? OFFSET ? `;
    params.push(limit, offset);
    console.log("Ausgeführte SQL-Abfrage: ", sql); // Log der SQL-Abfrage
    console.log("Verwendete Parameter: ", params); // Log der verwendeten Parameter
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        let debugQuery = sql;
        params.forEach(param => {
            debugQuery = debugQuery.replace('?', `'${param}'`);
        });
        res.json({
            message: {
                array : [whereClause, sql, filters,"Test"],
                query: sql,
                debug: debugQuery,
                param: params,
                data: rows
            },
            data: rows,
            currentPage: page
        });
    });
});

// Route, um alle BeachMatches abzurufen
router.get('/BeachMatches',(req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 1000;
    let offset = (page - 1) * limit;
    let params = [];

    let filters = [];
    if (req.query.NoInTournament) {
        filters.push("NoInTournament LIKE ?");
        params.push(`%${req.query.NoInTournament}%`);
    }
    if (req.query.LocalDate) {
        filters.push("LocalDate LIKE ?");
        params.push(`%${req.query.LocalDate}%`);
    }

    if (req.query.LocalTime) {
        filters.push("LocalTime LIKE ?");
        params.push(`%${req.query.LocalTime}%`);
    }
    if (req.query.TeamAName) {
        filters.push("TeamAName LIKE ?");
        params.push(`%${req.query.TeamAName}%`);
    }
    if (req.query.TeamBName) {
        filters.push("TeamBName LIKE ?");
        params.push(`%${req.query.TeamBName}%`);
    }

    if (req.query.Court) {
        filters.push("Court LIKE ?");
        params.push(`%${req.query.Court}%`);
    }
    if (req.query.MatchPointsA) {
        filters.push("MatchPointsA LIKE ?");
        params.push(`%${req.query.MatchPointsA}%`);
    }
    if (req.query.MatchPointsB) {
        filters.push("MatchPointsB LIKE ?");
        params.push(`%${req.query.MatchPointsB}%`);
    }

    if (req.query.PointsTeamASet1) {
        filters.push("PointsTeamASet1 LIKE ?");
        params.push(`%${req.query.PointsTeamASet1}%`);
    }
    if (req.query.PointsTeamBSet1) {
        filters.push("PointsTeamBSet1 LIKE ?");
        params.push(`%${req.query.PointsTeamBSet1}%`);
    }
    if (req.query.PointsTeamASet2) {
        filters.push("PointsTeamASet2 LIKE ?");
        params.push(`%${req.query.PointsTeamASet2}%`);
    }
    
    if (req.query.PointsTeamBSet2) {
        filters.push("PointsTeamBSet2 LIKE ?");
        params.push(`%${req.query.PointsTeamBSet2}%`);
    }
    if (req.query.PointsTeamASet3) {
        filters.push("PointsTeamASet3 LIKE ?");
        params.push(`%${req.query.PointsTeamASet3}%`);
    }

    if (req.query.PointsTeamBSet3) {
        filters.push("PointsTeamBSet3 LIKE ?");
        params.push(`%${req.query.PointsTeamBSet3}%`);
    }
    if (req.query.DurationSet1) {
        filters.push("DurationSet1 LIKE ?");
        params.push(`%${req.query.DurationSet1}%`);
    }
    if (req.query.DurationSet2) {
        filters.push("DurationSet2 LIKE ?");
        params.push(`%${req.query.DurationSet2}%`);
    }
    if (req.query.DurationSet3) {
        filters.push("DurationSet3 LIKE ?");
        params.push(`%${req.query.DurationSet3}%`);
    }
    if (req.query.No) {
        filters.push("No LIKE ?");
        params.push(`%${req.query.No}%`);
    }

    let whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const sql = `SELECT * FROM BeachMatches ${whereClause} LIMIT ? OFFSET ? `;
    params.push(limit, offset);
    console.log("Ausgeführte SQL-Abfrage: ", sql); // Log der SQL-Abfrage
    console.log("Verwendete Parameter: ", params); // Log der verwendeten Parameter
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        let debugQuery = sql;
        params.forEach(param => {
            debugQuery = debugQuery.replace('?', `'${param}'`);
        });
        res.json({
            message: {
                array : [whereClause, sql, filters,"Test"],
                query: sql,
                debug: debugQuery,
                param: params,
                data: rows
            },
            data: rows,
            currentPage: page
        });
    });
});
    
// Route, um alle BeachRounds abzurufen
router.get('/beachrounds', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 1000;
    let offset = (page - 1) * limit;
    let params = [];

    let filters = [];

    if (req.query.No) {
        filters.push("No LIKE ?");
        params.push(`%${req.query.No}%`);
    }
    if (req.query.Code) {
        filters.push("Code LIKE ?");
        params.push(`%${req.query.Code}%`);
    }

    if (req.query.Name) {
        filters.push("Name LIKE ?");
        params.push(`%${req.query.Name}%`);
    }
    if (req.query.Bracket) {
        filters.push("Bracket LIKE ?");
        params.push(`%${req.query.Bracket}%`);
    }
    if (req.query.Phase) {
        filters.push("Phase LIKE ?");
        params.push(`%${req.query.Phase}%`);
    }
    if (req.query.StartDate) {
        filters.push("StartDate LIKE ?");
        params.push(`%${req.query.StartDate}%`);
    }
    if (req.query.EndDate) {
        filters.push("EndDate LIKE ?");
        params.push(`%${req.query.EndDate}%`);
    }


    let whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const sql = `SELECT * FROM BeachRounds ${whereClause} LIMIT ? OFFSET ? `;
    params.push(limit, offset);
    console.log("Ausgeführte SQL-Abfrage: ", sql); // Log der SQL-Abfrage
    console.log("Verwendete Parameter: ", params); // Log der verwendeten Parameter
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        let debugQuery = sql;
        params.forEach(param => {
            debugQuery = debugQuery.replace('?', `'${param}'`);
        });
        res.json({
            message: {
                array : [whereClause, sql, filters,"Test"],
                query: sql,
                debug: debugQuery,
                param: params,
                data: rows
            },
            data: rows,
            currentPage: page
        });
    });
});
    
    module.exports = router;