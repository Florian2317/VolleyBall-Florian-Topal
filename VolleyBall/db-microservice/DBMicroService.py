import requests
import sqlite3
from xml.etree import ElementTree

from pathlib import Path

# Pfad zur Datenbank
db_path = Path("/usr/src/app/data/VolleyBallDB.db")


# Basis URL
BASE_URL = "https://www.fivb.org/Vis2009/XmlRequest.asmx"
HEADERS = {"Content-Type": "text/xml"}  # Required header for XML payload

def create_tables(cursor):
    # Tabelle für Spieler erstellen
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Players (
            No TEXT PRIMARY KEY,
            FederationCode TEXT,
            FirstName TEXT,
            LastName TEXT,
            Gender TEXT,
            PlaysBeach BOOLEAN,
            PlaysVolley BOOLEAN,
            TeamName TEXT
        )
    ''')

    # Tabelle für BeachTeams erstellen
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS BeachTeams (
            NoPlayer1 TEXT,
            NoPlayer2 TEXT,
            Name TEXT,
            Rank INTEGER,
            EarnedPointsTeam INTEGER,
            EarningsTeam INTEGER,
            No INTEGER PRIMARY KEY,
            FOREIGN KEY (NoPlayer1) REFERENCES Players(No),
            FOREIGN KEY (NoPlayer2) REFERENCES Players(No)
        )
    ''')
    

    # Tabelle für VolleyballTournaments erstellen
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS VolleyballTournaments (
            Code TEXT,
            Name TEXT,
            StartDate DATE,
            EndDate DATE,
            No INTEGER PRIMARY KEY,
            FOREIGN KEY (Code) REFERENCES Events(Code)
        )
    ''')

    # Tabelle für BeachMatches erstellen (inklusive Fremdschlüssel zu VolleyballTournaments)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS BeachMatches (
            NoInTournament TEXT,
            LocalDate DATE,
            LocalTime TIME,
            TeamAName TEXT,
            TeamBName TEXT,
            Court TEXT,
            MatchPointsA INTEGER,
            MatchPointsB INTEGER,
            PointsTeamASet1 INTEGER,
            PointsTeamBSet1 INTEGER,
            PointsTeamASet2 INTEGER,
            PointsTeamBSet2 INTEGER,
            PointsTeamASet3 INTEGER,
            PointsTeamBSet3 INTEGER,
            DurationSet1 INTEGER,
            DurationSet2 INTEGER,
            DurationSet3 INTEGER,
            No INTEGER PRIMARY KEY,
            FOREIGN KEY (NoInTournament) REFERENCES VolleyballTournaments(No),
            FOREIGN KEY (TeamAName) REFERENCES BeachTeams(Name),
            FOREIGN KEY (TeamBName) REFERENCES BeachTeams(Name)
        )
    ''')

    # Tabelle für BeachRounds erstellen
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS BeachRounds (
            Code TEXT,
            Name TEXT,
            Bracket TEXT,
            Phase TEXT,
            StartDate DATE,
            EndDate DATE,
            No INTEGER PRIMARY KEY
        )
    ''')

    # Tabelle für Events erstellen
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Events (
            Code TEXT, 
            Name TEXT, 
            StartDate DATE, 
            EndDate DATE         
        )
    ''')



def fetch_and_insert_data(xml_payload, table_name, fields, cursor):
    response = requests.post(BASE_URL, data=xml_payload, headers=HEADERS)
    if response.status_code == 200:
        root = ElementTree.fromstring(response.text)
        records = []
        if table_name != 'BeachMatches' or 'BeachRounds':
            for record in root.findall(table_name[:-1]):
                record_data = tuple(record.attrib.get(field, None) for field in fields)
                records.append(record_data)
        if table_name == 'BeachMatches':
            #print(response.text)
            for record in root.findall('BeachMatch'):
                record_data = tuple(record.attrib.get(field, None) for field in fields)
                records.append(record_data)
            #print(records)
        if table_name == 'BeachRounds':
            beach_rounds = root.find('BeachRounds')
            for beach_round in beach_rounds.findall('BeachRound'):
                record_data = tuple(beach_round.attrib.get(field, None) for field in fields)
                records.append(record_data)


            # Erstellen des SQL-Insert-Statements
        placeholders = ', '.join(['?'] * len(fields))
        insert_query = f'INSERT OR IGNORE INTO {table_name} ({", ".join(fields)}) VALUES ({placeholders})'

        cursor.executemany(insert_query, records)
        print(f"{table_name} data inserted into the database successfully!")
    else:
        print(f"Failed to fetch {table_name} with status code: {response.status_code}")


def main():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    create_tables(cursor)

    # Daten für Spieler holen und einfügen
    player_payload = "<Request Type='GetPlayerList' Fields='FederationCode FirstName Gender LastName Nationality PlaysBeach PlaysVolley TeamName No'/>"
    player_fields = ['No', 'FederationCode', 'FirstName', 'LastName', 'Gender', 'PlaysBeach', 'PlaysVolley', 'TeamName']
    fetch_and_insert_data(player_payload, 'Players', player_fields, cursor)

    # Daten für BeachTeams holen und einfügen
    team_payload = "<Request Type='GetBeachTeamList' Fields='NoPlayer1 NoPlayer2 Name Rank EarnedPointsTeam EarningsTeam No '/>"
    team_fields = ['NoPlayer1', 'NoPlayer2', 'Name', 'Rank', 'EarnedPointsTeam', 'EarningsTeam', 'No']
    fetch_and_insert_data(team_payload, 'BeachTeams', team_fields, cursor)

    # Daten für BeachMatches holen und einfügen
    match_payload = "<Request Type='GetBeachMatchList' Fields='NoInTournament LocalDate LocalTime TeamAName TeamBName Court MatchPointsA MatchPointsB PointsTeamASet1 PointsTeamBSet1 PointsTeamASet2 PointsTeamBSet2 PointsTeamASet3 PointsTeamBSet3 DurationSet1 DurationSet2 DurationSet3 No'> <Filter InMainDraw='true'/> </Request>"
    match_fields = ['NoInTournament', 'LocalDate', 'LocalTime', 'TeamAName', 'TeamBName', 'Court', 'MatchPointsA', 'MatchPointsB', 'PointsTeamASet1', 'PointsTeamBSet1', 'PointsTeamASet2', 'PointsTeamBSet2', 'PointsTeamASet3', 'PointsTeamBSet3', 'DurationSet1', 'DurationSet2', 'DurationSet3', 'No']
    fetch_and_insert_data(match_payload, 'BeachMatches', match_fields, cursor)

    # Daten für BeachRounds holen und einfügen
    round_payload = """
        <Requests> <Request Type='GetBeachRoundList' Fields='Code Name Bracket Phase StartDate 
        EndDate No'></Request></Requests>         
        """
    round_fields = ['Code', 'Name', 'Bracket', 'Phase', 'StartDate', 'EndDate', 'No']
    fetch_and_insert_data(round_payload, 'BeachRounds', round_fields, cursor)

    # Daten für VolleyballTournaments holen und einfügen
    tournament_payload = "<Request Type='GetVolleyTournamentList' Fields='No Code Name StartDate EndDate '> <Filter Statuses='Scheduled Running Finished'/> </Request>"
    tournament_fields = ['No', 'Code', 'Name', 'StartDate', 'EndDate']
    fetch_and_insert_data(tournament_payload, 'VolleyballTournaments', tournament_fields, cursor)

    # Daten für Events holen und einfügen
    event_payload = "<Request Type='GetEventList' Fields='Code Name StartDate EndDate'> <Filter IsVisManaged='True' NoParentEvent='0' HasBeachTournament='True' /> </Request>"
    event_fields = ['Code', 'Name', 'StartDate', 'EndDate']
    fetch_and_insert_data(event_payload, 'Events', event_fields, cursor)



    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()
