const INFO_STORE_KEY = "userId";

// Messages from popup.js to content.js
const GET_INIT_DATA_MESSAGE = "getInitData";
const JOIN_ROOM_MESSAGE = "joinRoom";
const CREATE_ROOM_MESSAGE = "createRoom";
const TOGGLE_SIDEBAR_MESSAGE = "sidebarToggle";
const LEAVE_ROOM_MESSAGE = "leaveRoom";
const READY_UP_MESSAGE = "readyUp";
const ENQUE_IN_SIDEBAR = "sidebarEnqueue";
const RESET_ROOM_MESSAGE = "resetRoom";
const START_ROOM_MESSAGE = "startRoom";
const START_ROOM_TIMER_MESSAGE = "startRoomTimer";
const DISPLAY_CODE_MESSAGE = "displaySubmittedCode";
const USER_VIEWED_CODE_MESSAGE = "userViewedCode";
const OPEN_HOW_TO_MODAL = "openHowToModal";

// Messages from server to socket listener
const USER_ID_MESSAGE = "userId";
const NEW_MEMBER_MESSAGE = "newMember";
const ROOM_CLOSING_MESSAGE = "roomClosing";
const USER_LEFT_MESSAGE = "userLeftRoom";
const USER_READY_UP_MESSAGE = "userReadyUp";
const USER_SUBMITTED = "userSubmitted";
const GAME_OVER_MESSAGE = "gameOver";
const ROOM_READY_MESSAGE = "roomReady";
const ROOM_STARTED_MESSAGE = "roomStarted";

// Messages from content.js to server socket
const NEW_SOCKET_MESSAGE = "newSocket";
const GET_NEW_USER_ID_MESSAGE = "getNewUserId";

// Messages from content.js to popup.js
const UPDATE_DOM_MESSAGE = "updateDom";

// Room States
const INIT_ROOM_STATE = "initState";
const PRE_STARTED_ROOM_STATE = "roomBeingPreparedState";
const STARTED_ROOM_STATE = "roomStartedState";
const GAME_OVER_STATE = "gameOverState";
