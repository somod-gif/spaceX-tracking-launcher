import React from "react";
import { useState, useEffect } from "react";
import './LaunchTracker.css';
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches';

function LaunchTracker() {
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const launchesPerPage = 10;

    useEffect(() => {
        fetch(SPACEX_API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                setLaunches(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            }, []);
    });

    const indexOfLastLaunch = currentPage * launchesPerPage;
    const indexOfFirstLaunch = indexOfLastLaunch - launchesPerPage;
    const currentLaunches = launches.slice(indexOfFirstLaunch, indexOfLastLaunch);
    const totalPages = Math.ceil(launches.length / launchesPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div>
            <h1 className="title">SpaceX Launch Tracker</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <p>Here’s a description for your SpaceX Tracking Launcher website:

                "The SpaceX Tracking Launcher website provides real-time data on SpaceX launches, leveraging an API to deliver the latest information on upcoming and past launches. Users can track launch schedules, explore mission details, and stay informed about launch statuses—all in a streamlined, user-friendly interface. Ideal for space enthusiasts and fans of SpaceX, the site offers insights and up-to-date information at the click of a button."</p>
            <ul className="launches-list">
                {currentLaunches.map((launch) => (
                    <li key={launch.id} className="launch-item">
                        <h2 className="launch-item-name">{launch.name}</h2>
                        <p className="launch-item-date">Date: {new Date(launch.date_utc).toLocaleDateString()}</p>
                        <p className="launch-item-rocket">RocketID: {launch.rocket}</p>
                        <p className="launch-item-site">
                            Launch SiteID: {launch.launchpad}
                        </p>
                        <p className="launch-item-details">
                            Details: {launch.details ? launch.details : 'No details available for this launch'}
                        </p>
                        <a href={launch.links.webcast} className="launch-item-lauched" target="_blank" rel="noopener noreferrer">
                            Watch The Launch on Youtube
                        </a>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => handleClick(pageNumber)}
                        disabled={pageNumber === currentPage}
                        className={`pagination-button ${pageNumber === currentPage ? 'active' : ''}`}
                    >
                        {pageNumber}
                    </button>))
                }
            </div>
        </div>
    );
}

export default LaunchTracker;