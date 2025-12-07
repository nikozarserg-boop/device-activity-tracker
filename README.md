# WhatsApp Activity Tracker

> ⚠️ **DISCLAIMER**: Proof-of-concept for educational and security research purposes only. Demonstrates privacy vulnerabilities in WhatsApp and Signal.

## Overview

This project implements the research from the paper **"Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers"** by Gabriel K. Gegenhuber, Maximilian Günther, Markus Maier, Aljosha Judmayer, Florian Holzbauer, Philipp É. Frenzel, and Johanna Ullrich (University of Vienna & SBA Research).

**What it does:** By measuring Round-Trip Time (RTT) of WhatsApp message delivery receipts, this tool can detect:
- When a user is actively using their device (low RTT)
- When the device is in standby/idle mode (higher RTT)
- Potential location changes (mobile data vs. WiFi)
- Activity patterns over time

**Security implications:** This demonstrates a significant privacy vulnerability in messaging apps that can be exploited for surveillance.

See `paper.pdf` for detailed research methodology and findings.

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/whatsapp-activity-tracker.git
cd whatsapp-activity-tracker

# Install dependencies
npm install
cd client && npm install && cd ..
```

**Requirements:** Node.js 16+, npm, WhatsApp account

## Usage

### Web Interface (Recommended)

```bash
# Terminal 1: Start backend
npm run start:server

# Terminal 2: Start frontend
npm run start:client
```

Open `http://localhost:3000`, scan QR code with WhatsApp, then enter phone number to track (e.g., `491701234567`).

### CLI Interface

```bash
npm start
```

Follow prompts to authenticate and enter target number.

## How It Works

1. **Probe Messages**: Sends harmless reaction messages to non-existent message IDs
2. **RTT Measurement**: Measures time between send and delivery acknowledgment
3. **State Detection**: Analyzes RTT patterns to determine device state:
   - **Online**: Low RTT (~200-800ms) - actively using device
   - **Standby**: Higher RTT (~1000-3000ms) - idle/screen off
   - **Offline**: Very high RTT or timeout (>5000ms)

The vulnerability: Devices respond significantly faster when actively in use compared to standby mode.

## Understanding Output

- **RTT (ms)**: Current round-trip time
- **Avg(3)**: Moving average of last 3 measurements
- **State**: Online / Standby / Offline / Calibrating
- **Threshold**: Baseline for state detection

## Project Structure

```
whatsapp-tracker/
├── src/
│   ├── tracker.ts      # Core RTT analysis logic
│   ├── server.ts       # Backend API server
│   └── index.ts        # CLI interface
├── client/             # React web interface
├── paper.pdf           # Research paper
└── package.json
```

## Ethical & Legal Considerations

**⚠️ Important:**
- For **research and education only**
- Do NOT track people without explicit consent
- May violate privacy laws in your jurisdiction
- Highlights need for better privacy protections in messaging apps

**Authentication data** (`auth_info_baileys/`) is stored locally - never commit to version control.

## Citation

Based on research by Gegenhuber et al., University of Vienna & SBA Research:

```bibtex
@inproceedings{gegenhuber2024careless,
  title={Careless Whisper: Exploiting Silent Delivery Receipts to Monitor Users on Mobile Instant Messengers},
  author={Gegenhuber, Gabriel K. and G{\"u}nther, Maximilian and Maier, Markus and Judmayer, Aljosha and Holzbauer, Florian and Frenzel, Philipp {\'E}. and Ullrich, Johanna},
  year={2024},
  organization={University of Vienna, SBA Research}
}
```

## License

MIT License - See LICENSE file.

Built with [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)

---

**Use responsibly. This tool demonstrates real security vulnerabilities that affect millions of users.**

