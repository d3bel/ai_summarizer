import { useState, useEffect } from "react";
import "./PopupMenu.css"; // import CSS file for styling
import { copy, linkIcon, loader, tick } from "../../assets";

import { lang_selector } from "../../constants/lang_selector";
import { useLazyGetTranslateQuery } from "../../services/article";
import { TranslatedText } from "./TranslatedText";

function PopupMenu(article) {
  const list = Object.values(lang_selector);
  const [selected, setSelected] = useState(undefined);
  const [translatedArticle, setTranslatedArticle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(list.slice(0, 10));

  const [getTranslate, { errorTr, isFetchingTr }] = useLazyGetTranslateQuery();

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && !event.target.closest(".popup-menu")) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedHandle = async (e) => {
    const value = e.target.textContent.trim();
    setSelected(value);
    setIsOpen(!isOpen);
    const selectedLanguage = Object.keys(lang_selector).find(
      (key) => lang_selector[key] === value
    );
    const text = Object.values(article);
    const trans = async () => {
      const translatedData = await getTranslate({
        text: [...text],
        source: "en",
        target: selectedLanguage,
      });
      return translatedData;
    };
    const trDATA = await trans();
    setTranslatedArticle(Object.values(trDATA.data.data.translations)[0]);
  };

  function handleScroll(event) {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      setDisplayedItems(list.slice(0, displayedItems.length + 10));
    }
  }

  return (
    <>
      {isFetchingTr ? (
        <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
      ) : errorTr ? (
        <p className="font-inter font-bold text-black text-center">
          Well, that was not supposed to happen...
          <br />
          <span className="font-satoshi font-normal text-gray-700">
            {errorTr?.data?.error}
          </span>
        </p>
      ) : (
        <div className="relative flex justify-center items-center mt-5">
          <button
            type="button"
            className="black_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <div className="popup-menu">
              <span onClick={() => setIsOpen(!isOpen)}>
                {selected ? selected : "Translate"}
              </span>

              {isOpen && (
                <div className="popup-menu-content" onScroll={handleScroll}>
                  <ul>
                    {list.map((lang, index) => (
                      <li key={index} onClick={selectedHandle}>
                        {lang}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </button>
        </div>
      )}
      {translatedArticle && (
        <p className="font-inter font-medium text-sm text-gray-700 border-t-red-950 mt-5">
          {translatedArticle}
        </p>
      )}
    </>
  );
}

export default PopupMenu;
