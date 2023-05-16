import { useState, useEffect } from "react";

import { loader } from "../../assets";
import { lang_selector } from "../../constants/lang_selector";
import { useLazyGetTranslateQuery } from "../../services/article";

function PopupMenu(article) {
  const list = Object.values(lang_selector);
  const [selected, setSelected] = useState(undefined);
  const [translatedArticle, setTranslatedArticle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(list.slice(0, 10));

  const [getTranslate, { error, isFetching }] = useLazyGetTranslateQuery();

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && !event.target.closest(".bg-slate-50")) {
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

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      setDisplayedItems(list.slice(0, displayedItems.length + 10));
    }
  };

  const handleClose = () => {
    setTranslatedArticle("");
    setSelected("Translate");
  };

  return (
    <>
      {isFetching ? (
        <div className="my-10 max-w-full flex justify-center items-center">
          <img
            src={loader}
            alt="loader"
            className="flex justify-center items-center w-20 h-20 object-contain"
          />
        </div>
      ) : error ? (
        <p className="font-inter font-bold text-black text-center">
          Well, that was not supposed to happen...
          <br />
          <span className="font-satoshi font-normal text-gray-700">
            {error?.data?.error}
          </span>
        </p>
      ) : (
        <div className="relative flex justify-center items-center mt-5">
          <button
            type="button"
            className="black_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            <div className="relative">
              <span onClick={() => setIsOpen(!isOpen)}>
                {selected ? selected : "Translate"}
              </span>

              {isOpen && (
                <div
                  className="absolute left-0 top-10 z-10 bg-slate-50 border border-gray-300 rounded-lg shadow-md max-h-200 overflow-y-auto p-2 text-black mx-auto"
                  onScroll={handleScroll}
                >
                  <ul className="list-none m-0 p-0">
                    {list.map((lang, index) => (
                      <li
                        className="p-1 cursor-pointer hover:bg-gray-300"
                        key={index}
                        onClick={selectedHandle}
                      >
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
      {translatedArticle && (
        <div className="relative flex justify-center items-center mt-5">
          <button
            type="button"
            className="black_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default PopupMenu;
