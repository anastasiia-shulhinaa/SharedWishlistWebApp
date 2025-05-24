import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import WishlistView from './components/WishlistView';
import Guest from './components/Guest';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wishlist/:shareCode" element={<WishlistView />} />
                <Route path="/wishlist/share/:shareCode" element={<Guest />} />
            </Routes>
        </Router>
    );
}

export default App;
