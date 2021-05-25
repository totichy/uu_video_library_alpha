//@@viewOn:imports
import "uu5g04-bricks";
import { createVisualComponent, useRef, useLsi } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import UU5 from "uu5g04";
import Config from "./config/config.js";
import VideoList from "../bricks/video-list.js";
import VideoProvider from "../bricks/video-provider.js";
import VideoCreate from "../bricks/video-create.js";
import VideoLsi from "../config/video";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Home",
  //@@viewOff:statics
};

export const Home = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOn:propTypes

  //@@viewOff:propTypes

  //@@viewOn:defaultProps

  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hook
    const createVideoRef = useRef();
    const deleteVideoRef = useRef();
    const ratingVideoRef = useRef();
    const updateVideoRef = useRef();
    //@@viewOff:hook

    const delVideoText = VideoLsi.delVideo || {};
    const wasDeleted = VideoLsi.wasDeleted || {};
    const wasCreated = VideoLsi.wasCreated || {};
    const createError = VideoLsi.errorCreate || {};
    const errorServerData = VideoLsi.errorServer || {};

    let videoWithTitle = useLsi(delVideoText);
    let wasDeletedC = useLsi(wasDeleted);
    let wasCreatedC = useLsi(wasCreated);
    let errorCreated = useLsi(createError);
    let serverErrorData = useLsi(errorServerData);

    //@@viewOn:private
    function showError(content) {
      UU5.Environment.getPage().getAlertBus().addAlert({
    content,
    colorSchema: "red",
    closeTimer: 3000
      })
    }

    function showSuccess(content) {
      UU5.Environment.getPage().getAlertBus().addAlert({
    content,
    colorSchema: "green",
    closeTimer: 3000
      })
    }

    async function handleCreateVideo(video) {
      try {
      await createVideoRef.current(video);
      showSuccess(`${videoWithTitle} ${video.title} ${wasCreatedC}`);
      } catch (e) {
        if (e.response) {
          // client received an error response (5xx, 4xx)
          showError(`ERROR: ${e.response.data.message}`);
        } else if (e.request) {
          // client never received a response, or request never left
          showError(errorCreated);
        } else {
          showError(errorCreated);
        }
      }
    }    

    async function handleUpdateVideo(video) {
      try {
      await updateVideoRef.current(video);
      showSuccess(`${videoWithTitle} ${video.title} ${wasCreatedC}`);
      } catch (e) {
        if (e.response) {
          // client received an error response (5xx, 4xx)
          showError(`ERROR: ${e.response.data.message}`);
        } else if (e.request) {
          // client never received a response, or request never left
          showError(errorCreated);
        } else {
          showError(errorCreated);
        }
      }
    }    

    async function handleDeleteVideo(video) {
      try {
      await deleteVideoRef.current({code : video.code},video.code);
      showSuccess(`${videoWithTitle} ${video.title} ${wasDeletedC}`);
      } catch (e) {

        if (e.response) {
          // client received an error response (5xx, 4xx)
          showError(`ERROR: ${e.response.data.error_message}`);
        } else if (e.request) {
          // client never received a response, or request never left
          showError(`Deletion of ${video.title} is failed.`);
        } else {
          showError(`Deletion of ${video.title} is failed.`);
        }
     
      }
    }   

    async function handleRatingVideo(video, mrating) {
      try {
      await ratingVideoRef.current({code : video.code, mrating: Number(mrating)});
      showSuccess("Děkujeme za hodnocení, které bylo: " + mrating );
      } catch (e) {
      showError(`Rating of ${video.title} is failed.`);
      }
    }  
    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function renderError(errorData) {
      return <UU5.Bricks.Error content={serverErrorData} />;
      }

    function renderReady(videos) {
       videos.sort((a, b) => (a.code < b.code) ? 1 : -1);
      return (
        <>
          <VideoCreate onCreate={handleCreateVideo} />
          <UU5.Bricks.Section>
            <VideoList videos={videos} onDelete={handleDeleteVideo} onUpdate={handleUpdateVideo} onRating={handleRatingVideo} />
          </UU5.Bricks.Section>
        </>
      );
    }


    //@@viewOn:interface

    //@@viewOff:interface

    //@@viewOn:render

    return (
      <div>
        <VideoProvider>
          {({ state, data, newData, pendingData, errorData, handlerMap }) => {

            createVideoRef.current = handlerMap.createVideo;
            deleteVideoRef.current = handlerMap.deleteVideo;
            ratingVideoRef.current = handlerMap.ratingVideo;
            updateVideoRef.current = handlerMap.updateVideo;

            switch (state) {
                case "pending":
                case "pendingNoData":
                  return renderLoad();
                case "error":
                case "errorNoData":
                  return renderError(errorData);
                case "itemPending":
                case "ready":
                case "readyNoData":
                default:
                  return renderReady(data);  
            }

          }}
        </VideoProvider>
      </div>
    );
    //@@viewOff:render
  },
});

export default Home;
