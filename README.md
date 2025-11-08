# ESAP Cafe ☕

A beautiful and modern React Native cafe app built with Expo, featuring a menu system, shopping cart, and state management with Zustand.

## Features

- 🏠 **Home Screen**: Welcome page with cafe features and information
- 📋 **Menu Screen**: Browse cafe items with category filters
- 🛒 **Cart Screen**: Manage your order with quantity controls
- 📦 **State Management**: Zustand for efficient and simple state management
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 📱 **Navigation**: Expo Router for file-based navigation

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Expo Router**: File-based routing
- **Zustand**: State management
- **Expo Vector Icons**: Beautiful icon set

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo Go app on your mobile device (optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd esap-cafe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator
   - Or press `w` for web browser

## Project Structure

```
esap-cafe/
├── app/                    # Expo Router screens
│   ├── _layout.js         # Root layout with navigation
│   ├── index.js           # Home screen
│   ├── menu.js            # Menu screen
│   └── cart.js            # Cart screen
├── store/                 # State management
│   └── cafeStore.js       # Zustand store with menu items and cart logic
├── components/            # Reusable components (empty for now)
├── assets/               # Images and static assets
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── README.md             # This file
```

## Available Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS simulator (macOS only)
- `npm run web`: Run in web browser

## State Management

The app uses Zustand for state management [[memory:6391002]]. The store (`store/cafeStore.js`) manages:

- Menu items with categories
- Shopping cart functionality
- Add/remove/update cart items
- Calculate totals and item counts
- Filter items by category

## Menu Items

The app comes with sample menu items including:
- ☕ Coffee (Espresso, Cappuccino, Latte, Iced Coffee)
- 🍵 Tea (Green Tea)
- 🥐 Pastries (Croissant, Blueberry Muffin)
- 🍰 Desserts (Chocolate Cake)

## Features in Detail

### Home Screen
- Welcome message with cafe branding
- Feature highlights with icons
- Quick navigation to menu and cart
- Business hours information
- Cart badge showing item count

### Menu Screen
- Category filters (All, Coffee, Tea, Pastry, Dessert)
- Item cards with name, description, and price
- Quick add to cart functionality
- Visual feedback when items are added
- Floating cart button with badge

### Cart Screen
- List of cart items with quantities
- Increase/decrease quantity controls
- Remove individual items
- Clear entire cart option
- Order total calculation
- Place order functionality
- Empty cart state

## Customization

### Adding New Menu Items

Edit `store/cafeStore.js` and add items to the `menuItems` array:

```javascript
{
  id: 9,
  name: 'Your Item',
  category: 'Category',
  price: 4.99,
  description: 'Item description',
  image: '🍕',
}
```

### Changing Colors

The app uses a coffee-themed color palette:
- Primary: `#6B4423` (Coffee brown)
- Background: `#F5F5DC` (Beige)
- Accent: `#2C5F2D` (Green)
- Alert: `#E74C3C` (Red)

Update these colors in the respective screen style sheets.

## Future Enhancements

- User authentication
- Order history
- Payment integration
- Push notifications
- Loyalty rewards system
- Table reservation
- Real-time order tracking

## License

MIT License

## Author

Built with ❤️ for ESAP Cafe

---

Enjoy your coffee! ☕

