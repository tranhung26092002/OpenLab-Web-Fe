import { GrMail } from "react-icons/gr";
import { Tooltip } from "react-tooltip";
import flagVN from "@assets/icon/vietnam_flags.png";
import flagEN from "@assets/icon/united-states_flags.png";
import './NavContact.scss'
const NavContact = () => {
  return (
    <div className="flex justify-between items-center px-14 py-3 bg-gradient-to-r from-blue-900 from-0% via-cyan-800 via-58% to-sky-800 to-100% text-white">
      <div className="flex">
        <span className="flex gap-1 items-center">
          <GrMail />
          openlab.user@gmail.com
        </span>
      </div>
      <div className="flex  gap-2 items-center">
        <div className="flag-container w-[46px] h-[46px]">
          <img
            alt="VN-Flag"
            src={flagVN}
            className="object-cove cursor-pointer"
            data-tooltip-id="option-language"
          />
        </div>

        <Tooltip id="option-language" place="bottom-end" clickable>
          <div className="container-option flex bg-white">
            <div className="content-option flex flex-col text-black text-sm">
              <div className="cursor-pointer flex items-center  px-2 hover:bg-[#d2d3d4] gap-4 hover:text-white rounded-sm">
                <img
                  alt="flag-en"
                  src={flagEN}
                  className="object-cove cursor-pointer w-[40px] h-[40px]"
                />
                <span>English</span>
              </div>
              <div className="cursor-pointer flex items-center px-2 hover:bg-[#d2d3d4] gap-4 hover:text-white rounded-sm ">
                <img
                  alt="flag-vn"
                  src={flagVN}
                  className="object-cove cursor-pointer w-[40px] h-[40px]"
                />
                <span>Tiếng Việt</span>
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavContact;
