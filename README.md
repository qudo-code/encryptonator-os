# EncryptornatorOS 🔐

A retro-futuristic encrypted notes application that combines the nostalgia of classic Windows interfaces with modern security features. Share encrypted messages through URLs while enjoying a unique operating system experience.

![EncryptornatorOS](./screenshot.png)

## ✨ Features

### 🖥️ Multi-Era Windows Themes
- **Windows 98**: Classic gray interface with iconic 3D elements
- **Windows XP**: Vibrant blue and green with gradient effects
- **Windows Vista/7**: Aero glass effects with transparency
- **Windows 10**: Modern flat design with minimalist elements
- **Windows 11**: Contemporary centered layout with rounded corners

### 🚀 Retro-Futuristic Boot Experience
- Custom space-themed boot screen
- Era-appropriate loading animations
- Dynamic star field background
- Themed progress indicators
- Nostalgic boot messages

### 🔒 Encryption Features
- End-to-end encryption for messages
- URL-based encrypted message sharing
- Quantum-safe encryption algorithms
- Password-protected content
- Secure message history

### 💫 Modern UI Elements
- Draggable windows with resize support
- Interactive taskbar with running applications
- Start menu with application launcher
- File explorer for message history
- Control panel for theme customization

### 🎮 Bonus Features
- Cybersecball game (security-themed Pinball)
- RetroTube video player
- Message history viewer
- Theme customization options

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/encryptonator.git
cd encryptonator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📦 Dependencies

- **Svelte**: UI framework
- **TypeScript**: Type safety and developer experience
- **98.css**: Authentic Windows 98 styling
- **Pako**: Compression for encrypted messages
- **js-dos**: DOS emulation for retro features

## 🔧 Configuration

### Theme Selection
Themes can be changed through the Control Panel or by modifying the `currentTheme` variable:
```typescript
type Theme = 'win98' | 'winxp' | 'vista' | 'win7' | 'win10' | 'win11';
```

### Encryption Settings
The application uses strong encryption by default. You can customize the encryption settings in `src/lib/crypto.ts`.

## 🎨 Customization

### Adding New Themes
1. Define the theme type in `src/lib/types.ts`
2. Add theme-specific styles in your components
3. Create theme assets (icons, backgrounds)
4. Update the Control Panel options

### Creating New Windows
1. Create a new `.svelte` component in `src/lib/`
2. Follow the window template structure
3. Add to the taskbar and start menu
4. Implement window management hooks

## 🌟 Usage

### Creating Encrypted Messages
1. Open the Encryptor application
2. Enter your message and password
3. Click "Encrypt Message"
4. Share the generated URL

### Reading Encrypted Messages
1. Open the shared URL
2. Enter the provided password
3. View the decrypted message
4. Messages are saved in history

### Managing Messages
1. Open File Explorer
2. View message history
3. Sort by date or status
4. Delete or archive messages

## 🔐 Security

- All encryption is performed client-side
- No data is stored on servers
- Passwords are never transmitted
- Uses modern cryptographic standards
- Regular security audits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [98.css](https://github.com/jdan/98.css) for Windows 98 styling
- [Microsoft](https://www.microsoft.com) for UI inspiration
- Open source community for various tools and libraries

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/yourusername/encryptonator/issues) page
2. Create a new issue if needed
3. Join our community discussions

---

Made with 💖 by [Your Name]
