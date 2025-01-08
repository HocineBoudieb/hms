import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Example icon

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Header />
      <div className='flex flex-col ml-64 mt-16 bg-[#f8f8f8]'>
        <h1 className="text-2xl first-letter:text-4xl font-thin tracking-[0.2em] ml-8 mt-8">DASHBOARD SITE PARIS</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-4 p-8 ">
            <StatCard
              title="Total Alerts"
              value="10"
              percentageChange={5}
              isIncrease={false}
              Icon={ErrorOutlineIcon}
              iconColor="#FF5733"
            />
            <StatCard
              title="Total Alerts"
              value="10"
              percentageChange={5}
              isIncrease={false}
              Icon={ErrorOutlineIcon}
              iconColor="#FF5733"
            />
            <StatCard
              title="Total Alerts"
              value="10"
              percentageChange={5}
              isIncrease={false}
              Icon={ErrorOutlineIcon}
              iconColor="#FF5733"
            />
            <StatCard
              title="Total Alerts"
              value="10"
              percentageChange={5}
              isIncrease={false}
              Icon={ErrorOutlineIcon}
              iconColor="#FF5733"
            />
            <StatCard
              title="Total Alerts"
              value="10"
              percentageChange={5}
              isIncrease={false}
              Icon={ErrorOutlineIcon}
              iconColor="#FF5733"
            />
        </div>
      </div>
    </div>
    
  );
}

export default App;
