import React from 'react';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressPanel } from '../components/ProgressPanel';
import useDebts from '../hooks/useDebts';

const IconButton: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <Link to={to} className="icon-button">
    <div className="icon-wrap">{icon}</div>
    <div className="icon-label">{label}</div>
  </Link>
);

const Home: React.FC = () => {
  const { debts } = useDebts();

  return (
    <div className="home-page">
      <div className="home-content">
        <ProgressPanel debts={debts} />
        <div className="home-actions">
          <IconButton to="/debts" icon={<Wallet size={28} />} label="Debts" />
          <IconButton to="/expenses" icon={<TrendingDown size={28} />} label="Expenses" />
          <IconButton to="/income" icon={<TrendingUp size={28} />} label="Income" />
        </div>
      </div>
    </div>
  );
};

export default Home;
