import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Route , Routes} from "react-router-dom";
// import { AnimatePresence } from "framer-motion";
// import Navbar from "./components/Navbar/Navbar"
import Homepage from "./pages/Homepage/Homepage"
 import MyList from './pages/MyList/MyList';
 import Auth from "./pages/Auth/Auth";
 import { AnimatePresence } from "framer-motion";
import Siderbar from "./components/SiderBar/SiderBar";
// import DetailModal from "./components/DetailModal/DetailModal";
// import SplashAnimation from "./components/SplashAnimation/SplashAnimation";

import { selectCurrentUser } from './redux/auth/auth.selectors';
// import { selectSearchResults } from "./redux/search/search.selectors";
import { checkUserSession } from "./redux/auth/auth.actions";
// import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';
// import { fetchFavouritesAsync } from './redux/favourites/favourites.actions';
import requests from './requests';
import { setDefaultAudioListValuesAsync } from './redux/audioplaying/audioplaying.actions';
import { fetchNarratorsAsync } from './redux/narrators/narrators.actions';
import Navbar from "./components/Navbar/Navbar";
 import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
// import { getLocalStorageCurrentUser } from './shared/localStorage'

const App = () => {

    const currentUser = useSelector(selectCurrentUser);
    // const currentUser = getLocalStorageCurrentUser();
    //const searchResults = useSelector(selectSearchResults);
    const dispatch = useDispatch();
   //const location = useLocation();
    // dispatch(fetchFavouritesAsync);
    if(currentUser){
        const urlDefaultAudioValues = requests.fetchTrendingMovies;
        dispatch(setDefaultAudioListValuesAsync(urlDefaultAudioValues));
        const urlNarrators = requests.fetchNarrators;
        dispatch(fetchNarratorsAsync(urlNarrators));
    }

    useEffect(() => {
        dispatch(checkUserSession());
    }, [dispatch])

    return (
        <div className="App">
             {currentUser && (
                <div>
                    <Navbar/>
                    <Siderbar />
                </div>
            )}
              <AnimatePresence exitBeforeEnter>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={< Auth/>}
                    >
                    </Route>
                    <Route
                        path="/browse"
                        element= { currentUser ? <Homepage /> : <Auth/>}
                    />
                    <Route
                    exact
                    path="*"
                    element= {<Auth />} 
                    />
                    <Route
                        exact
                        path="/mylist"
                        element= { currentUser ? <MyList /> : <Auth />}
                    />
                    {/* <Route
                        exact
                        path="/"
                        element={ currentUser ?  <Auth />: <Homepage />}
                    /> */}
                    {/* <Route path="*">
                    </Route> */}
                </Routes>
         </AnimatePresence>
         {currentUser && (
                <>
                    <AudioPlayer />
                </>
            )}
        </div>
    )
}

export default App;
