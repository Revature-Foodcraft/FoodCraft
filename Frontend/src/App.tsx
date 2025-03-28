
import './App.css'
import foodcraftLogo from './assets/FoodCraft-Logo.png';
const App: React.FC = () => {
  return (
    <div>
      <h1>Welcome to FoodCraft</h1>
      <img src= {foodcraftLogo} alt="FoodCraft Logo" />
    </div>
  );
};

export default App;
