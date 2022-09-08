import "./navbar.scss";
import { useState, useRef } from "react";
import useViewport from "../../hooks/useViewport";
import useScroll from "../../hooks/useScroll";
import useOutsideClick from "../../hooks/useOutsideClick";
import { motion } from "framer-motion";
import { navbarFadeInVariants } from "../../motionUtils";
import { LOGO_URL, MOBILE_LOGO_URL } from "../../requests";
import { FaCaretDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";
import {FaRegBell} from 'react-icons/fa'
//import { useDispatch } from "react-redux";
// import { useDispatch } from "react-redux";
// import { selectCurrentUser } from "../../redux/auth/auth.selectors";
// import { signOutStart } from "../../redux/auth/auth.actions";
// import { getLocalStorageCurrentUser, removeUserAuth } from '../../shared/localStorage'

const Navbar = () => {
	const { width } = useViewport();
	const isScrolled = useScroll(70);
	const [genresNav, setGenresNav] = useState(false);
	const [profileNav, setProfileNav] = useState(false);
	const genresNavRef = useRef();
	const profileNavRef = useRef();
	//const currentUser = useSelector(selectCurrentUser);
	// const currentUser = getLocalStorageCurrentUser();
	//const dispatch = useDispatch();

	useOutsideClick(genresNavRef, () => {
		if (genresNav) setGenresNav(false);
	});
	useOutsideClick(profileNavRef, () => {
		if (profileNav) setProfileNav(false);
	});

	return (
		<>
			<motion.nav
				className={`Navbar ${isScrolled && "Navbar__fixed"}`}
				variants={navbarFadeInVariants}
				initial="hidden"
				animate="visible"
				exit="hidden"
			>
				<Link to="/browse">
					<img className="Navbar__logo" src={width >= 600 ? LOGO_URL : MOBILE_LOGO_URL} alt="" />
				</Link>
				<div className="Navbar__secondarynav">
						<Searchbar />
					</div>
				{/* {width >= 1024 ? (
					<ul className="Navbar__primarynav Navbar__navlinks">
						<li className="Navbar__navlinks--link">
							<NavLink to="/browse" activeClassName="activeNavLink">
								Home
							</NavLink>
						</li>
						<li className="Navbar__navlinks--link">
							<NavLink to="/mylist" activeClassName="activeNavLink">
								My list
							</NavLink>
						</li>
						<li className="Navbar__navlinks--link">
							<a href="http://linguoo.com/community/" target="_blank" rel="noreferrer">
								<span>Community</span>
							</a>
						</li>
					</ul>
				) : (
					<div
						className={`Navbar__primarynav Navbar__navlinks ${isScrolled && "Navbar__primarynav--scrolled"}`}
						onClick={() => setGenresNav(!genresNav)}
					>
						<span className="Navbar__navlinks--link">Discover</span>
						<FaCaretDown className="Navbar__primarynav--toggler Navbar__primarynav--caret" />
						<div
							className={`Navbar__primarynav--content ${genresNav ? "active" : ""}`}
						>
							{genresNav && (
								<ul
									className="Navbar__primarynav--content-wrp"
									ref={genresNavRef}
								>
									<li className="Navbar__navlinks--link">
										<NavLink to="/browse" activeClassName="activeNavLink">
											Home
										</NavLink>
									</li>
									<li className="Navbar__navlinks--link">
										<NavLink to="/mylist" activeClassName="activeNavLink">
											My list
										</NavLink>
									</li>
									<li className="Navbar__navlinks--link">
										<a href="http://linguoo.com/community/" target="_blank" rel="noreferrer">
											<span>Community</span>
										</a>
									</li>
								</ul>
							)}
						</div>
					</div>
				)} */}
				<div className="Navbar__secondarynav">
					
					<div className="Navbar__navitem">
						
							{/* <img
								className="Navbar__navprofile--avatar Navbar__navprofile--toggler"
								src={currentUser && currentUser.photoURL ? currentUser.photoURL : PROFILE_PIC_URL}
								alt="Profile Picture"
							/> */}

							<FaCaretDown className="Navbar__navprofile--toggler Navbar__navprofile--caret" />
							<div className={`Navbar__navprofile--content ${profileNav ? "active" : ""}`}>
								{/* {profileNav && (
									<ul
										className="Navbar__navprofile--content-wrp"
										ref={profileNavRef}
									>
										{currentUser && (
											<li
												className="Navbar__navlinks--link"
												onClick={() => {dispatch(signOutStart())}}
												// onClick={() => {removeUserAuth(); }}
												// onClick={() => {removeUserAuth(); dispatch(signOutStart())}}
											>
												Sign Out
											</li>
										)}
									</ul>
								)} */}
							</div>
					</div>
				</div>
				<div className="Navbar__Notifiction">
				<FaRegBell color="rgb(153, 148, 148)"/>
				</div>
				
			</motion.nav>
		</>
	);
};

export default Navbar;