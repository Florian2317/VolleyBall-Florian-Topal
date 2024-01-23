# Verwenden eines offiziellen Python-Runtime als Eltern-Image
FROM python:3.8

# Arbeitsverzeichnis im Container festlegen
WORKDIR /usr/src/app

# Kopieren der benötigten Dateien in das Container-Arbeitsverzeichnis
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Kopieren des restlichen Projektverzeichnisses in das Arbeitsverzeichnis des Containers
COPY . .

# Port, auf dem die Anwendung im Container läuft, freigeben
EXPOSE 8000

# Befehl, der ausgeführt wird, wenn der Container startet
CMD ["python", "./DBMicroService.py"]
