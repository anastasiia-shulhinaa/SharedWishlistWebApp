import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import WishlistView from './components/WishlistView';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wishlist/:shareCode" element={<WishlistView />} />
            </Routes>
        </Router>
    );
}

export default App;
