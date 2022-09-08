//#region Imports

import "./rowPoster.scss";
import { BASE_IMG_URL, FALLBACK_IMG_URL } from "../../requests";
import { useDispatch, useSelector } from "react-redux";
import { addToFavouritesAsync, removeFromFavouritesAsync } from "../../redux/favourites/favourites.actions";
import { addToVotedAsync, addToPlayedAsync } from '../../redux/playsandvotes/playsandvotes.actions'; 
import { FaPlus, FaMinus, FaPlay, FaPause, FaHeart, FaStop } from "react-icons/fa";
import useGenreConversion from "../../hooks/useGenreConversion";
import { showModalDetail } from "../../redux/modal/modal.actions";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { selectFavouritesList } from '../../redux/favourites/favourites.selectors';
import { useNavigate  } from "react-router-dom";

import { fetchplaylistsAsync } from  '../../redux/playlists/playlists.actions';
import {setAudioPlayingCompleteData, setAudioPaused, setAudioStoped } from '../../redux/audioplaying/audioplaying.actions';
import { selectAudioPlayingSelector } from '../../redux/audioplaying/audioplaying.selectors';
import { fetchMovieDataConfig } from '../../dataConfig'
import { calcTimeToShow } from '../../shared/timer/calcTime';
import { removeContinueListeningArticle, pushContinueListeningArticle } from '../../redux/listcontinuelistening/listcontinuelistening.actions';
import { selectContinueListeningData } from '../../redux/listcontinuelistening/listcontinuelistening.selectors'
// import { setDefaultAudioListValuesAsync } from '../../redux/audioplaying/audioplaying.actions';
import { updateVotesSuccess, updatePlaysSuccess } from '../../redux/movies/movies.actions'

//#endregion

const RowPoster = result => {

	const preventUndefinedSelector = () => undefined;

//#region NonPlayingBehaviorVariableDefinitions

	const { item, 
		item: { 
			_id, 
			title, 
			original_name, 
			original_title, 
			name, genre_ids, 
			poster_path, 
			backdrop_path, 
			isLinguoo, 
			isPlaylist, 
			audio, 
			duration, 
			plays, 
			upVotes, 
			status, 
			playListName, 
			category,
			idList,
			fromPlaylist }, 
			isLarge, 
			isFavourite 
		} = result;
	const history = useNavigate()
	const favs = useSelector(selectFavouritesList);
	
	const fMDC = fetchMovieDataConfig;
	
	const [data] = idList ? fMDC.filter(el => el.id == idList) : fMDC.filter(el => el.categoryid == category);
	const selectorCatList = data ? data.selector : preventUndefinedSelector; 
	const selectedCurrentListBySelector = useSelector(selectorCatList);

	const selectedCurrentList = !fromPlaylist ? selectedCurrentListBySelector : { data: [result.item] }  

	const idPlayList = favs && favs.some(item => item._id == _id) ? favs.filter(item => item._id == _id)[0].idPlayList : null;
	const [isLocalFavourite, setIsLocalFavourite] = useState(idPlayList ? true : false);

	let fallbackTitle = title || original_title || name || original_name;
	const genresConverted = useGenreConversion(genre_ids);
	const dispatch = useDispatch();

	const [isVotedUp, setIsVotedUp] = useState(status && status == 'upVote');
	const [showPlayIcon, setShowPlayIcon] = useState(true)
	const [durationToShow, setDurationToShow] = useState('');

//#endregion	

//#region PlayingBehaviorVariableDefinitions

	const selectorAudioPlaying = selectAudioPlayingSelector ? selectAudioPlayingSelector : preventUndefinedSelector
	const audioPlaying = useSelector(selectorAudioPlaying);
	const [isPlayingPaused, setIsPlayingPaused] = useState(false);
	const { articleid, trackingProgress, isPlaying } = audioPlaying;
	// const [localTrackingProgress, setLocalTrackingProgress] = useState(trackingProgress);
	// const [localTrackingProgress, setLocalTrackingProgress] = useState(0.1);
	const [localTrackingProgress, setLocalTrackingProgress] = useState(0);

    const continueListeningSelector = selectContinueListeningData ? selectContinueListeningData : preventUndefinedSelector;
    const selectedContinueListening = useSelector(continueListeningSelector);
	// const [publicLocalTrackingProgress, setPublicLocalTrackingProgress] = useState(0);
	const existsInContinueListening = selectedContinueListening && 
	selectedContinueListening.data && 
	selectedContinueListening.data.length > 0 &&
	selectedContinueListening.data.some(cl => cl._id == _id);

//#endregion	

//#region NonPlayingBehaviorHandlers

	const handleAdd = event => {
		event.stopPropagation();
		// dispatch(addToFavourites({ ...item, isFavourite }));
		dispatch(addToFavouritesAsync(item));
		setIsLocalFavourite(true);
	};
	const handleRemove = event => {
		event.stopPropagation();
		dispatch(removeFromFavouritesAsync(item, idPlayList));
		// dispatch(removeFromFavouritesAsync({ _id, isFavourite }));
		// dispatch(removeFromFavourites({ ...item, isFavourite }));
		setIsLocalFavourite(false);
	};
	const handleModalOpening = () => {
		dispatch(showModalDetail({ ...item, fallbackTitle, genresConverted, isFavourite }));
	}
	const handlePlayAction = event => {
		event.stopPropagation();
	};

	const handleVoteAction = event => {
		event.stopPropagation();
		if(!isVotedUp){
			setIsVotedUp(true);
			dispatch(addToVotedAsync(_id));
			dispatch(updateVotesSuccess(_id));
			console.log(status);
		}
	}

//#endregion	

//#region PlayingBehaviorHandlers

	const handlePlayActionLinguoo = event => {
		event.stopPropagation();
		dispatch(addToPlayedAsync(_id));
		dispatch(updatePlaysSuccess(_id));
		const prevUndefinedData = selectedCurrentList && selectedCurrentList.data ? selectedCurrentList.data : undefined;
			dispatch(setAudioPlayingCompleteData(
				audio, 
				category, 
				_id, 
				duration, 
				// localTrackingProgress > 0 ? localTrackingProgress : 1, 
				localTrackingProgress > 0 ? localTrackingProgress : 0.1, 
				// localTrackingProgress, 
				prevUndefinedData));
	}

	const stopActionLinguoo = () => {
		setLocalTrackingProgress(0);
		dispatch(setAudioStoped());
		dispatch(removeContinueListeningArticle(_id));
	}

	const handleStopActionLinguoo = event => {
		event.stopPropagation();		
		// if(selectedContinueListening && selectedContinueListening.data && 
		// 	selectedContinueListening.data.length > 0 &&
		// 	selectedContinueListening.data.find(cl => cl._id == _id)){
		// 		const currentArticle = selectedContinueListening.data.find(cl => cl._id == _id);
		// 		currentArticle.localTrackingProgress = 0
		// 		setPublicLocalTrackingProgress(0);
		// }
		// else {
			stopActionLinguoo();
		// }
	}

	const handlePauseActionLinguoo = event => {
		event.stopPropagation();
		// setLocalTrackingProgress(trackingProgress);
		dispatch(setAudioPaused());
		dispatch(pushContinueListeningArticle(result, localTrackingProgress));
	}

//#endregion

//#region NonPlayingBehaviorEffects

	useEffect(()=> {
		setDurationToShow(calcTimeToShow(duration))
	},[duration])


	const [selectedPlayList, setSelectedPlaylist] = useState('');

	const handlePlayListOpening = () =>
	{
		setSelectedPlaylist(playListName);
		// dispatch(setDefaultAudioListValuesAsync(url));
		history.push('/playlistcontent');
	}

	useEffect(()=> {
		selectedPlayList !== '' && dispatch(fetchplaylistsAsync(selectedPlayList, fallbackTitle));
	}, [selectedPlayList])

//#endregion

//#region PlayingBehaviorEffects

	// useEffect(()=>{
	// 	if(articleid == _id && trackingProgress > 0){			
	// 		setIsPlayingPaused(true);
	// 		setShowPlayIcon(!isPlaying);
	// 	}
	// 	else{
	// 		setIsPlayingPaused(false);
	// 		setShowPlayIcon(true);
	// 	}
	// 	setLocalTrackingProgress(trackingProgress);
	// },[articleid, isPlaying])

	// useEffect(()=> {
	// 	// if(localTrackingProgress === 0 ){
	// 		if(selectedContinueListening && selectedContinueListening.data && 
	// 			selectedContinueListening.data.length > 0 &&
	// 			selectedContinueListening.data.find(cl => cl._id == _id)){
	// 				const currentArticle = selectedContinueListening.data.find(cl => cl._id == _id);
	// 				if( currentArticle.localTrackingProgress === 0){
	// 					stopActionLinguoo();						
	// 					dispatch(removeContinueListeningArticle(_id));						
	// 				}
	// 		}
	// 		// setLocalTrackingProgress(0);
	// 	// }
	// }, [publicLocalTrackingProgress])

	useEffect(()=> {
		if(!existsInContinueListening && 
			!isPlaying && 
			localTrackingProgress > 0){
			setLocalTrackingProgress(0);
			// dispatch(setAudioStoped());
		}
	},[existsInContinueListening, isPlaying])

	useEffect(()=>{
		if(articleid == _id){ 
			//Current article
			if(trackingProgress > 0){
				setIsPlayingPaused(true);
				setShowPlayIcon(!isPlaying);
			}
			else {
				setIsPlayingPaused(false);
				setShowPlayIcon(true);				
			}
			setLocalTrackingProgress(trackingProgress);
		}
		else{
			//Any article different than current one
			if(localTrackingProgress > 0){
				setIsPlayingPaused(true);
				setShowPlayIcon(true);
			}
			else{
				setIsPlayingPaused(false);
				setShowPlayIcon(true);
			}
		}
	},[articleid, isPlaying, localTrackingProgress])

//#endregion	
	
	return (
		<div
			className={`Row__poster--big`}
			onClick={!isPlaylist ? handleModalOpening : () => handlePlayListOpening() }
			>
			{ !isPlaylist ?
			(<div style={{witdth: '200px', height: '250px', overflow: 'hidden', position: 'relative'}}>
				<div style={{witdth: '200px', height: '150px', overflow: 'hidden', position: 'relative'}} >
					{isLarge ? (
						poster_path ? (
							isLinguoo ?
							<img src={`${poster_path}`} alt={fallbackTitle} /> 
							: <img src={`${BASE_IMG_URL}/${poster_path}`} alt={fallbackTitle} />
							) : ""
					) : backdrop_path ? (
						isLinguoo ?
						<img src={`${backdrop_path}`} alt={fallbackTitle} /> 
						: <img src={`${BASE_IMG_URL}/${backdrop_path}`} alt={fallbackTitle} />
					) : (
						<>
							<img src={FALLBACK_IMG_URL} alt={fallbackTitle} />
							<div className="Row__poster__fallback">
								<span>{fallbackTitle}</span>
							</div>
						</>
					)}
				</div>
			</div>)
			: ( isLarge ? (
				poster_path ? (
					isLinguoo ?
					<img src={`${poster_path}`} alt={fallbackTitle} /> 
					: <img src={`${BASE_IMG_URL}/${poster_path}`} alt={fallbackTitle} />
					) : ""
			) : backdrop_path ? (
				isLinguoo ?
				<img src={`${backdrop_path}`} alt={fallbackTitle} /> 
				: <img src={`${BASE_IMG_URL}/${backdrop_path}`} alt={fallbackTitle} />
			) : (
				<>
					<img src={FALLBACK_IMG_URL} alt={fallbackTitle} />
					<div className="Row__poster__fallback">
						<span>{fallbackTitle}</span>
					</div>
				</>
			))
			
			}

			<div className="Row__poster-info">
				<div className="Row__poster-info--iconswrp">
					{ isLinguoo ? 	
					( isPlaylist ? null : 
					( showPlayIcon ? <button
						className={isPlayingPaused ? "Row__poster-info--icon-reverse icon--play" : "Row__poster-info--icon icon--play"}
						onClick={handlePlayActionLinguoo}
					>
						<FaPlay />
					</button> : 
					<button
						className="Row__poster-info--icon icon--play"
						onClick={handlePauseActionLinguoo}
					>
						<FaPause />
					</button>					
					) 				
					)
					: 
					(<Link
						className="Row__poster-info--icon icon--play"
						onClick={handlePlayAction}
						to={'/play'}
					>
						<FaPlay />
					</Link>) 
					}
					{
						isLinguoo ?						
						( isPlaylist ? null :		
							(
							isPlayingPaused ? <button
							className="Row__poster-info--icon icon--play"
							onClick={handleStopActionLinguoo}
						>
							<FaStop />
						</button> : null)) : null						 
					}
					{!isPlaylist && (isLocalFavourite
						? (
							<button className='Row__poster-info--icon icon--favourite' onClick={handleRemove}>
								<FaMinus />
							</button>
						): (
							<button className='Row__poster-info--icon icon--favourite' onClick={handleAdd}>
								<FaPlus />
							</button>
						))
					}
					{
						isLinguoo ?
						(isPlaylist ? null : <button
							className={isVotedUp ? "Row__poster-info--icon-reverse icon--play" : "Row__poster-info--icon icon--play"}
							onClick={handleVoteAction}
						>
							<FaHeart />
						</button>) : null						 
					}

				</div>
				{ !isPlaylist ? <div className="Row__poster-info--iconswrp">
						<span style={{ fontSize:15, marginBottom:'0.3em' }}>{durationToShow}</span>
						<span style={{ fontSize:15, marginLeft:'2em' }}><FaPlay/></span>
						<span style={{ fontSize:15, marginLeft:'0.2em' }}>{plays}</span>
						<span style={{ fontSize:15, marginLeft:'2em' }}><FaHeart/></span>
						<span style={{ fontSize:15, marginLeft:'0.2em' }}>{upVotes}</span>
				</div> : null}
				<div className="Row__poster-info--title">
					<h3>{fallbackTitle}</h3>
				</div>
			</div>

		</div>		
	);
};

export default RowPoster;