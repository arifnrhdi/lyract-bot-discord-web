# Lyract Web

Flask website for the Lyract music bot.

## Run locally

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:DISCORD_CLIENT_ID = "your-discord-application-id"
flask --app app run --debug
```

The invite button redirects to Discord when `DISCORD_CLIENT_ID` is set. The bot token is not used by this website.
