import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUser, removeUser } from "../Utils/userSlice";
import { LOGO, supported_languages } from "../Utils/constants";
import { toggleGPTSearchView } from "../Utils/gptSlice";
import { changeLanguage } from "../Utils/configSlice";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        navigate("/error");
      });
  };

  const hanbleGPTSearchClick = () => {
    dispatch(toggleGPTSearchView());
  }
  const hangleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value))
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="absolute w-full px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
      <img className="w-44 py-1" src={LOGO} alt="Logo"></img>
      {user && (
        <div className="flex items-center gap-2">
          <select className="px-2 py-1" onChange={hangleLanguageChange}>
            {supported_languages.map(lang => <option value={lang.identifier} key={lang.identifier}>{lang.name}</option>)}
          </select>
          <button className="text-white border border-white px-2 py-1 rounded-md mx-2" onClick={hanbleGPTSearchClick}>GPT Search</button>
          <img src={user.photoURL} alt="not found" className="w-8 h-8 "></img>

          <button className="text-white font-medium hover:opacity-80" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
