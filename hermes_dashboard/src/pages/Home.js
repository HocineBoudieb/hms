// Desc: Home page of the dashboard site
import StatCard from '../components/StatCard';
import Display from '../components/Display';

// Icons
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import SellIcon from '@mui/icons-material/Sell';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

import { useEffect,useState } from 'react';
import axios from 'axios';
import apiUrl from '../api';

const Home= () => {
    const [stats, setStats] = useState([]);
    //fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log("apiUrl",apiUrl);
                const response = await axios.get(apiUrl+'/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();

        //fetch every minute
        const interval = setInterval(fetchStats, 5000);

        //clear Timer when component unmount
        return () => clearInterval(interval);
    }, []);

    //const iconss = [Users, ErrorOutlineIcon, ContentCutIcon, ContentCutIcon, ErrorOutlineIcon, ErrorOutlineIcon];
    const icons = [AssignmentTurnedInIcon,PendingIcon,ContentCutIcon,ErrorOutlineIcon,HourglassDisabledIcon,SellIcon,EmojiPeopleIcon];
    const icon_colors = ['#3FFFBE', 'orange', '#FF8D1A', '#FF5733', 'blue', '#A93FBD', '#338F11'];
    return (
        <div className="flex min-h-screen bg-[#f8f8f8] min-w-full">
            <div className='flex flex-col ml-64 mt-16'>

                <h1 className="text-2xl first-letter:text-4xl font-thin tracking-[0.2em] ml-8 mt-8">Visualisation</h1>
                <Display />
                <h1 className="text-2xl first-letter:text-4xl font-thin tracking-[0.2em] ml-8 mt-8">TABLEAU DE BORD SITE PARIS</h1>
                <div className="flex flex-wrap gap-x-4 gap-y-4 p-8 min-w-full">
                    {/* StatCard */}  
                    {stats.map((stat,i) => (
                        <StatCard 
                            key={stat.id} 
                            title={stat.name} 
                            value={stat.value} 
                            percentageChange={stat.change} 
                            Icon={icons[i]} 
                            isIncrease={stat.isUp}
                            iconColor={icon_colors[i]} 
                            unit={stat.unit} 
                            color={stat.value === 0 ? 'black' : (stat.isUp ? (stat.right ? 'green' : 'red') : (stat.right ? 'red' : 'green'))}
                            date={stat.lastTime}  
                        />
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default Home;
