/**
 * GetAlbums Component
 *
 * This component is responsible for displaying a list of albums. It fetches albums data based
 * on the user's ID and handles pagination. The component allows for the creation, editing, and deletion
 * of albums, integrating modal components for these actions. It uses Redux for state management and
 * integrates with the router for navigation. The component conditionally renders different UI elements
 * based on whether the albums list is empty, and it includes a loading state for asynchronous operations.
 *
 * The component's structure includes:
 * - Hooks for state management and Redux actions.
 * - A fetchData function to retrieve albums data.
 * - Render logic for different states (loading, empty list, albums list).
 * - Pagination component integration.
 * - Modal components for creating, editing, and deleting albums.
 */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPlusCircle,
  faLayerGroup,
  faTrashAlt,
  faEdit,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { useShortModal } from "../../../context/ModalShort";

import { thunkGetAlbumsByUserId } from "../../../store/albums";
import Spinner from "../../Spinner";
import { selectAllAlbums, selectSessionUser } from "../../../store/selectors";
import { setError } from "../../../store/ui";
import Pagination from "../../Pagination";
import OpenShortModalButton from "../../Modals/OpenShortModalButton";
import CreateAlbumForm from "../AlbumForm/CreateAlbumForm";
import EditAlbumForm from "../AlbumForm/EditAlbumForm";
import DeleteAlbum from "../DeleteAlbum";

import "./GetAlbums.css";

const GetAlbums = () => {
  // Setup of hooks and state management variables
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const { closeShortModal } = useShortModal();

  const albums = useSelector(selectAllAlbums) || [];
  const sessionUser = useSelector(selectSessionUser);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlbumsFetched, setIsAlbumsFetched] = useState(false);

  const perPage = 2;
  const isCurrentUserProfile = sessionUser?.id === parseInt(userId);

  const showPagination = albums.length > 0;

  // Function to fetch albums data with pagination
  const fetchData = useCallback(
    async (page) => {
      setIsLoading(true);
      try {
        const response = await dispatch(
          thunkGetAlbumsByUserId(userId, page, perPage)
        );
        if (response) {
          setCurrentPage(response.current_page);
          setTotalPages(response.total_pages);
          setIsAlbumsFetched(true);
        }
      } catch (err) {
        console.error("Fetch Data Error:", err);
        dispatch(setError("An error occurred"));
        setIsAlbumsFetched(true);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, userId, perPage]
  );

  // useEffect to call fetchData on component mount or page change
  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  // Function to render album images
  const renderAlbumImages = (album) => {
    const imagesToShow =
      album?.images && Array.isArray(album?.images)
        ? activeAlbumId === album.id
          ? album?.images
          : album?.images.slice(0, 4)
        : [];

    return imagesToShow.map((image, index) => (
      <img
        key={index}
        src={image?.url}
        alt={`Image ${index} of ${album?.title}`}
        className="album-image"
      />
    ));
  };

  // Conditional rendering based on loading state and albums list
  // if (!albums || albums.length === 0) return null;
  if (isLoading) return <Spinner />;
  return (
    <div className="albums-main-container">
      {/* Conditional rendering for different scenarios: no albums, creating an album, and managing albums */}
      {isCurrentUserProfile && albums.length === 0 && (
        // ... No albums message and Create Album prompt ...
        <div className="no-albums-message">
          <p>You have no albums. Create an album?</p>
          <div className="create-album-prompt">
            <OpenShortModalButton
              className="create-album-button"
              buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
              modalComponent={
                <CreateAlbumForm
                  closeShortModal={closeShortModal}
                  currentPage={currentPage}
                  perPage={perPage}
                />
              }
            />
            <p>Create an album</p>
          </div>
        </div>
      )}

      {isCurrentUserProfile && albums.length > 0 && (
        // ... UI for creating an album and managing post images ...
        <>
          <div className="create-album-prompt">
            <OpenShortModalButton
              className="create-album-button"
              buttonText={<FontAwesomeIcon icon={faPlusCircle} />}
              modalComponent={
                <CreateAlbumForm
                  closeShortModal={closeShortModal}
                  currentPage={currentPage}
                  perPage={perPage}
                />
              }
            />
            <p>Create an album</p>
          </div>
          <div className="add-posts-to-an-album-button-container">
            <button
              className="add-posts-to-an-album-button"
              onClick={() => history.push("/owner/albums/manage")}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>Manage Post Images</span>
            </button>
          </div>
        </>
      )}

      {isAlbumsFetched && albums.length > 0 && (
        <div className="albums-container">
          {/* Mapping through albums and rendering album items */}
          {albums.map((album) => (
            // ... Album item rendering including edit and delete modals ...
            <>
              <div key={album?.id} className="album-item">
                <div className="album-delete-button">
                  <div
                    className="album-title"
                    onClick={() =>
                      history.push(`/albums/${album?.id}/users/${userId}`)
                    }
                  >
                    {album?.title}
                  </div>
                  {isCurrentUserProfile && (
                    <>
                      <div className="album-delete-edit-button">
                        <OpenShortModalButton
                          className="delete-edit-modal"
                          buttonText={<FontAwesomeIcon icon={faEdit} />}
                          modalComponent={
                            <EditAlbumForm
                              albumId={album?.id}
                              albumTitle={album?.title}
                              currentPage={currentPage}
                              perPage={perPage}
                              closeShortModal={() => {}}
                              setActiveAlbumImages={() => {}}
                              onEdit={() => fetchData()}
                            />
                          }
                        />
                        <OpenShortModalButton
                          className="delete-edit-modal"
                          buttonText={<FontAwesomeIcon icon={faTrashAlt} />}
                          modalComponent={
                            <DeleteAlbum
                              albumId={album?.id}
                              onDelete={() => fetchData()}
                            />
                          }
                        />
                        <button
                          className="add-posts-to-an-album-btn"
                          onClick={() =>
                            history.push(`/owner/posts/albums/${album?.id}/add`)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="add-to-album-icon"
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {renderAlbumImages(album)}
              </div>
            </>
          ))}
        </div>
      )}

      {showPagination && (
        <Pagination
          totalItems={totalPages * perPage}
          itemsPerPage={perPage}
          currentPage={currentPage}
          onPageChange={(newPage) => fetchData(newPage)}
        />
      )}
    </div>
  );
};

export default GetAlbums;
