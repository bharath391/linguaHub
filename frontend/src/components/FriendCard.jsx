import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div
      className="
        card
        bg-base-200
        rounded-xl
        border border-base-300
        transition-all
        duration-300
        hover:shadow-lg
        hover:scale-[1.02]
      "
    >
      <div className="card-body p-5 space-y-3">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-2">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* Language Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge badge-secondary badge-sm flex items-center gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline badge-sm flex items-center gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* Message Button */}
        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-primary btn-sm w-full rounded-full"
        >
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 w-auto mr-1 inline-block rounded-sm"
      />
    );
  }
  return null;
}
