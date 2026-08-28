"use strict";

/*
=============================================================
IZEL PORTFOLIO
Main JavaScript
=============================================================

Responsibilities:
1. Mobile navigation
2. Navbar scroll behavior
3. Active navigation state
4. Smooth anchor navigation
5. Showreel controls
6. Scroll reveal animations
7. Project / service micro-interactions
8. Accessibility support
9. Reduced-motion support

No external libraries required.
=============================================================
*/


/* ============================================================
   DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /*
    ------------------------------------------------------------
    INITIALIZE SITE
    ------------------------------------------------------------
    */

    initMobileNavigation();
    initNavbarScroll();
    initActiveNavigation();
    initSmoothScrolling();
    initShowreel();
    initProjectVideos();
    initScrollReveal();
    initExternalLinks();
    initPageLoad();
    initAboutPage();

});



/* ============================================================
   GLOBAL SITE STATE
   ============================================================ */

const siteState = {
    isMenuOpen: false,
    isScrolled: false,
    prefersReducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
};



/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */

function initMobileNavigation() {

    const menuButton = document.querySelector(
        ".mobile-menu-toggle"
    );

    const mobileNavigation = document.querySelector(
        ".mobile-navigation"
    );

    const mobileLinks = document.querySelectorAll(
        ".mobile-nav-link"
    );


    /*
    If the required elements don't exist,
    stop safely instead of throwing errors.
    */

    if (!menuButton || !mobileNavigation) {
        return;
    }


    /*
    ------------------------------------------------------------
    OPEN / CLOSE MENU
    ------------------------------------------------------------
    */

    function toggleMenu() {

        siteState.isMenuOpen = !siteState.isMenuOpen;

        const isOpen = siteState.isMenuOpen;


        menuButton.classList.toggle(
            "is-open",
            isOpen
        );


        mobileNavigation.classList.toggle(
            "is-open",
            isOpen
        );


        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        mobileNavigation.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );


        /*
        Prevent background scrolling while the mobile menu
        is open.
        */

        document.body.style.overflow = isOpen
            ? "hidden"
            : "";
    }


    /*
    ------------------------------------------------------------
    CLOSE MENU
    ------------------------------------------------------------
    */

    function closeMenu() {

        siteState.isMenuOpen = false;

        menuButton.classList.remove(
            "is-open"
        );

        mobileNavigation.classList.remove(
            "is-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileNavigation.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    /*
    ------------------------------------------------------------
    BUTTON CLICK
    ------------------------------------------------------------
    */

    menuButton.addEventListener(
        "click",
        toggleMenu
    );


    /*
    ------------------------------------------------------------
    CLOSE AFTER CLICKING A LINK
    ------------------------------------------------------------
    */

    mobileLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {
                closeMenu();
            }
        );

    });


    /*
    ------------------------------------------------------------
    CLOSE WHEN CLICKING OUTSIDE THE MENU
    ------------------------------------------------------------
    */

    document.addEventListener(
        "click",
        (event) => {

            if (!siteState.isMenuOpen) {
                return;
            }


            const clickedInsideMenu =
                mobileNavigation.contains(event.target);


            const clickedButton =
                menuButton.contains(event.target);


            if (
                !clickedInsideMenu &&
                !clickedButton
            ) {
                closeMenu();
            }

        }
    );


    /*
    ------------------------------------------------------------
    ESCAPE KEY
    ------------------------------------------------------------
    */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                siteState.isMenuOpen
            ) {
                closeMenu();

                menuButton.focus();
            }

        }
    );


    /*
    ------------------------------------------------------------
    DESKTOP RESIZE SAFETY
    ------------------------------------------------------------

    If someone opens the mobile menu and then rotates their
    phone / resizes the browser into desktop width, reset
    the mobile menu state.
    */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 800 &&
                siteState.isMenuOpen
            ) {
                closeMenu();
            }

        }
    );

}



/* ============================================================
   NAVBAR SCROLL BEHAVIOR
   ============================================================ */

function initNavbarScroll() {

    const header = document.querySelector(
        ".site-header"
    );

    const navbar = document.querySelector(
        ".navbar"
    );


    if (!header || !navbar) {
        return;
    }


    /*
    ------------------------------------------------------------
    UPDATE NAVBAR STATE
    ------------------------------------------------------------
    */

    function updateNavbar() {

        const scrollPosition = window.scrollY;

        const shouldBeScrolled =
            scrollPosition > 30;


        if (
            shouldBeScrolled ===
            siteState.isScrolled
        ) {
            return;
        }


        siteState.isScrolled =
            shouldBeScrolled;


        header.classList.toggle(
            "is-scrolled",
            shouldBeScrolled
        );


        navbar.classList.toggle(
            "is-scrolled",
            shouldBeScrolled
        );

    }


    /*
    ------------------------------------------------------------
    PERFORMANCE
    ------------------------------------------------------------

    requestAnimationFrame prevents excessive layout work
    during rapid scrolling.
    */

    let ticking = false;


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    () => {

                        updateNavbar();

                        ticking = false;

                    }
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    /*
    Run once immediately.
    */

    updateNavbar();

}



/* ============================================================
   ACTIVE NAVIGATION
   ============================================================ */

function initActiveNavigation() {
    const desktopLinks = document.querySelectorAll(".nav-link");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    if (!desktopLinks.length && !mobileLinks.length) {
        return;
    }

    const allNavigationLinks = [
        ...desktopLinks,
        ...mobileLinks
    ];

    // ------------------------------------------------------------
    // DETERMINE CURRENT PAGE
    // ------------------------------------------------------------

    let currentPage = window.location.pathname.split("/").pop();

    // Empty pathname means the site root, so treat it as index.html
    if (!currentPage) {
        currentPage = "index.html";
    }

    // ------------------------------------------------------------
    // SET ACTIVE PAGE
    // ------------------------------------------------------------

    allNavigationLinks.forEach((link) => {
        let href = link.getAttribute("href");

        if (!href) {
            return;
        }

        // Remove any hash from the link
        href = href.split("#")[0];

        // If the link is just "#" or empty after removing the hash,
        // don't treat it as a page link.
        if (!href) {
            return;
        }

        const linkPage = href.split("/").pop();

        const isActive = linkPage === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}


    /*
    ------------------------------------------------------------
    CREATE LINK MAP
    ------------------------------------------------------------
    */

    const allNavigationLinks = [
        ...desktopLinks,
        ...mobileLinks
    ];


    /*
    ------------------------------------------------------------
    SET ACTIVE LINK
    ------------------------------------------------------------
    */

    function setActiveSection(
        sectionId
    ) {

        allNavigationLinks.forEach(
            (link) => {

                const linkTarget =
                    link.getAttribute("href");


                const isActive =
                    linkTarget ===
                    `#${sectionId}`;


                link.classList.toggle(
                    "active",
                    isActive
                );


                if (isActive) {

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    link.removeAttribute(
                        "aria-current"
                    );

                }

            }
        );

    }


    /*
    ------------------------------------------------------------
    INTERSECTION OBSERVER
    ------------------------------------------------------------

    Determines which section is currently visible.
    */

    const observerOptions = {
        root: null,

        rootMargin:
            "-30% 0px -60% 0px",

        threshold: 0
    };


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            setActiveSection(
                                entry.target.id
                            );

                        }

                    }
                );

            },
            observerOptions
        );


    sections.forEach(
        (section) => {
            observer.observe(section);
        }
    );



/* ============================================================
   SMOOTH SCROLLING
   ============================================================ */

function initSmoothScrolling() {

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");


                    /*
                    Ignore empty "#"
                    */

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    /*
                    Account for the fixed navbar.
                    */

                    const header =
                        document.querySelector(
                            ".site-header"
                        );


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight -
                        20;


                    window.scrollTo({
                        top: Math.max(
                            0,
                            targetPosition
                        ),

                        behavior:
                            siteState.prefersReducedMotion
                                ? "auto"
                                : "smooth"
                    });

                }
            );

        }
    );

}



/* ============================================================
   SHOWREEL
   ============================================================ */

function initShowreel() {

    const video = document.querySelector(
        ".showreel-video"
    );

    const playButton = document.querySelector(
        ".showreel-play-button"
    );

    const overlay = document.querySelector(
        ".showreel-overlay"
    );


    /*
    ------------------------------------------------------------
    CHECK REQUIRED ELEMENTS
    ------------------------------------------------------------
    */

    if (!video || !playButton) {
        console.warn(
            "IZEL: Showreel video or play button was not found."
        );

        return;
    }


    /*
    ------------------------------------------------------------
    FORCE INITIAL STATE
    ------------------------------------------------------------
    */

    video.pause();

    video.autoplay = false;
    video.muted = false;

    video.removeAttribute("autoplay");
    video.removeAttribute("muted");


    /*
    ------------------------------------------------------------
    UPDATE BUTTON
    ------------------------------------------------------------
    */

    function updatePlayButton() {

        const icon = playButton.querySelector(
            ".play-icon"
        );


        if (video.paused) {

            if (icon) {
                icon.textContent = "▶";
            }

            playButton.setAttribute(
                "aria-label",
                "Play showreel"
            );

            playButton.setAttribute(
                "aria-pressed",
                "false"
            );

        } else {

            if (icon) {
                icon.textContent = "Ⅱ";
            }

            playButton.setAttribute(
                "aria-label",
                "Pause showreel"
            );

            playButton.setAttribute(
                "aria-pressed",
                "true"
            );

        }

    }


    /*
    ------------------------------------------------------------
    PLAY / PAUSE BUTTON
    ------------------------------------------------------------
    */

    playButton.addEventListener(
        "click",
        async (event) => {

            /*
            Prevent the click from bubbling into other
            elements that might interfere with playback.
            */

            event.preventDefault();
            event.stopPropagation();


            try {

                if (video.paused) {

                    /*
                    The user explicitly clicked the button,
                    so the browser permits playback with audio.
                    */

                    video.muted = false;

                    await video.play();

                } else {

                    video.pause();

                }

            } catch (error) {

                console.error(
                    "IZEL showreel playback error:",
                    error
                );

            }

        }
    );


    /*
    ------------------------------------------------------------
    VIDEO PLAY EVENT
    ------------------------------------------------------------
    */

    video.addEventListener(
        "play",
        () => {

            updatePlayButton();

            if (overlay) {

                overlay.classList.add(
                    "is-playing"
                );

            }

        }
    );


    /*
    ------------------------------------------------------------
    VIDEO PAUSE EVENT
    ------------------------------------------------------------
    */

    video.addEventListener(
        "pause",
        () => {

            updatePlayButton();

            if (overlay) {

                overlay.classList.remove(
                    "is-playing"
                );

            }

        }
    );


    /*
    ------------------------------------------------------------
    VIDEO ENDED
    ------------------------------------------------------------
    */

    video.addEventListener(
        "ended",
        () => {

            updatePlayButton();

            if (overlay) {

                overlay.classList.remove(
                    "is-playing"
                );

            }

        }
    );


    /*
    ------------------------------------------------------------
    INITIAL STATE
    ------------------------------------------------------------
    */

    video.pause();

    updatePlayButton();


    /*
    ------------------------------------------------------------
    PAUSE WHEN TAB IS HIDDEN
    ------------------------------------------------------------
    */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                !video.paused
            ) {

                video.pause();

            }

        }
    );

}

/* ============================================================
   PROJECT VIDEOS
   ============================================================ */

function initProjectVideos() {

    const projectCards = document.querySelectorAll(
        ".project-card"
    );


    if (!projectCards.length) {
        return;
    }


    const projectGrid = projectCards[0].closest(".portfolio-grid");
    const projectGroups = projectGrid
        ? [...projectGrid.querySelectorAll(":scope > .project-group")]
        : [];

    projectGroups.forEach((group) => {
        const beforeCard = group.querySelector(
            ".project-pair > .project-card"
        );
        const number = beforeCard?.querySelector(
            ".project-number, .portfolio-project-number"
        )?.textContent.match(/\d{2}/)?.[0];
        const afterCard = [...projectCards].find((card) => {
            const cardNumber = card.querySelector(
                ".project-number, .portfolio-project-number"
            )?.textContent.match(/\d{2}/)?.[0];
            const category = card.querySelector(
                ".project-category, .portfolio-project-category"
            )?.textContent.trim();
            return cardNumber === number && category === "AFTER";
        });
        const pair = group.querySelector(".project-pair");

        if (pair && beforeCard && afterCard) {
            pair.replaceChildren(beforeCard, afterCard);
        }
    });


    document.querySelectorAll(".project-card").forEach((card) => {
        const media = card.querySelector(".project-media");

        if (!media) {
            return;
        }

            const video =
                media.querySelector(
                    ".project-video"
                );

            const playButton =
                media.querySelector(
                    ".project-play-button"
                );

            const playIcon =
                media.querySelector(
                    ".project-play-icon"
                );

            let comingSoon = media.querySelector(
                ".project-coming-soon, .coming-soon"
            );


            /*
            ----------------------------------------------------
            CHECK REQUIRED ELEMENTS
            ----------------------------------------------------
            */

            if (!video || !playButton) {
                return;
            }

            if (!comingSoon) {
                comingSoon = document.createElement("div");
                comingSoon.className = "project-coming-soon";
                comingSoon.textContent = "COMING SOON";
                comingSoon.hidden = true;
                media.appendChild(comingSoon);
            }


            /*
            ----------------------------------------------------
            INITIAL STATE
            ----------------------------------------------------
            */

            video.autoplay = false;
            video.muted = false;

            video.removeAttribute(
                "autoplay"
            );

            video.removeAttribute(
                "muted"
            );

            video.pause();

            card.classList.add("is-coming-soon");
            card.classList.remove("is-video");
            video.hidden = true;
            playButton.hidden = true;
            comingSoon.hidden = false;

            function setVideoAvailable() {
                card.classList.add("is-video");
                card.classList.remove("is-coming-soon");
                video.hidden = false;
                playButton.hidden = false;
                comingSoon.hidden = true;
            }

            function setComingSoon() {
                card.classList.add("is-coming-soon");
                card.classList.remove("is-video");
                video.pause();
                video.hidden = true;
                playButton.hidden = true;
                comingSoon.hidden = false;
            }

            video.addEventListener("loadedmetadata", setVideoAvailable);
            video.addEventListener("canplay", setVideoAvailable);
            video.addEventListener("error", setComingSoon);
            video.hidden = false;
            playButton.hidden = false;
            comingSoon.hidden = true;
            video.load();


            /*
            ----------------------------------------------------
            UPDATE PLAY BUTTON
            ----------------------------------------------------
            */

            function updateButton() {

                if (video.paused) {

                    if (playIcon) {
                        playIcon.textContent = "▶";
                    }

                    playButton.setAttribute(
                        "aria-label",
                        "Play project video"
                    );

                    playButton.setAttribute(
                        "aria-pressed",
                        "false"
                    );

                } else {

                    if (playIcon) {
                        playIcon.textContent = "Ⅱ";
                    }

                    playButton.setAttribute(
                        "aria-label",
                        "Pause project video"
                    );

                    playButton.setAttribute(
                        "aria-pressed",
                        "true"
                    );

                }

            }


            /*
            ----------------------------------------------------
            PLAY / PAUSE
            ----------------------------------------------------
            */

            playButton.addEventListener(
                "click",
                async (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    try {

                        if (video.paused) {

                            /*
                            The visitor explicitly clicked,
                            so audio playback is allowed.
                            */

                            video.muted = false;

                            await video.play();

                        } else {

                            video.pause();

                        }

                    } catch (error) {

                        console.error(
                            "IZEL project video playback error:",
                            error
                        );

                    }

                }
            );


            /*
            ----------------------------------------------------
            VIDEO EVENTS
            ----------------------------------------------------
            */

            video.addEventListener(
                "play",
                updateButton
            );


            video.addEventListener(
                "pause",
                updateButton
            );


            video.addEventListener(
                "ended",
                updateButton
            );


            /*
            ----------------------------------------------------
            INITIAL BUTTON STATE
            ----------------------------------------------------
            */

            updateButton();

    });

}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {

    /*
    If the user prefers reduced motion, don't animate
    content into existence.
    */

    if (siteState.prefersReducedMotion) {
        return;
    }


    /*
    ------------------------------------------------------------
    ELEMENTS TO REVEAL
    ------------------------------------------------------------
    */

    const revealElements =
        document.querySelectorAll(
            [
                ".section-eyebrow",
                ".section-title",
                ".section-header .text-link",
                ".project-card",
                ".service-item",
                ".service-card",
                ".about-visual",
                ".about-content",
                ".contact-cta",
                ".footer-top"
            ].join(", ")
        );


    if (!revealElements.length) {
        return;
    }


    /*
    ------------------------------------------------------------
    INITIAL STATE
    ------------------------------------------------------------
    */

    revealElements.forEach(
        (element) => {

            element.classList.add(
                "reveal"
            );

        }
    );


    /*
    ------------------------------------------------------------
    OBSERVER
    ------------------------------------------------------------
    */

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        /*
                        Once visible, stop observing.
                        */

                        observerInstance.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                root: null,

                rootMargin:
                    "0px 0px -10% 0px",

                threshold: 0.08
            }
        );


    revealElements.forEach(
        (element) => {

            observer.observe(
                element
            );

        }
    );

}



/* ============================================================
   EXTERNAL LINKS
   ============================================================ */

function initExternalLinks() {

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    externalLinks.forEach(
        (link) => {

            /*
            Security protection for new tabs.
            */

            const rel =
                link.getAttribute("rel") ||
                "";


            const relValues =
                new Set(
                    rel
                        .split(" ")
                        .filter(Boolean)
                );


            relValues.add("noopener");
            relValues.add("noreferrer");


            link.setAttribute(
                "rel",
                [...relValues].join(" ")
            );

        }
    );

}



/* ============================================================
   PAGE LOAD
   ============================================================ */

function initPageLoad() {

    /*
    Add a class to the body once the initial page
    structure has loaded.

    This gives CSS a reliable hook for entrance animations.
    */

    requestAnimationFrame(
        () => {

            document.body.classList.add(
                "page-loaded"
            );

        }
    );

}



/* ============================================================
   OPTIONAL: IMAGE ERROR HANDLING
   ============================================================ */

document.addEventListener(
    "error",
    (event) => {

        const element =
            event.target;


        if (
            element &&
            element.tagName === "IMG"
        ) {

            element.classList.add(
                "image-load-error"
            );

            console.warn(
                `IZEL image could not be loaded: ${
                    element.getAttribute("src") || "unknown"
                }`
            );

        }

    },
    true
);



/* ============================================================
   OPTIONAL: PAGE VISIBILITY
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        const video =
            document.querySelector(
                ".showreel-video"
            );


        if (!video) {
            return;
        }


        /*
        Don't waste video resources while the visitor
        has another browser tab open.
        */

        if (
            document.hidden &&
            !video.paused
        ) {

            video.pause();

        }

    }
);

/* =============================================================
   IZEL WORK PAGE
   ============================================================= */


/* =============================================================
   WORK PAGE PROJECT VIDEOS
   ============================================================= */

/*
    Handles play / pause controls for the project videos
    on work.html.

    Each project has:

    .portfolio-video
    .portfolio-play-button
    .portfolio-play-icon

    The video keeps its natural aspect ratio.
*/

const portfolioProjects = document.querySelectorAll(
    ".legacy-portfolio-project"
);


if (false) {
portfolioProjects.forEach((project) => {

    const video = project.querySelector(".project-video");
    const playButton = project.querySelector(".project-play-button");
    const playIcon = project.querySelector(".project-play-icon");
    let comingSoon = project.querySelector(".project-coming-soon");

    if (!video || !playButton) {
        return;
    }

    if (!comingSoon) {
        comingSoon = document.createElement("div");
        comingSoon.className = "project-coming-soon";
        comingSoon.textContent = "COMING SOON";
        comingSoon.hidden = true;
        video.parentElement.appendChild(comingSoon);
    }

    const projectLabel = project.querySelector(
        ".project-title, .portfolio-project-title"
    )?.textContent.trim() || "project video";

    function setVideoAvailable() {
        project.classList.remove("is-coming-soon");
        video.hidden = false;
        playButton.hidden = false;
        comingSoon.hidden = true;
    }

    function setComingSoon() {
        video.pause();
        video.hidden = true;
        playButton.hidden = true;
        comingSoon.hidden = false;
        project.classList.add("is-coming-soon");
    }

    function updateButton() {
        const isPlaying = !video.paused;

        if (playIcon) {
            playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
        }

        playButton.setAttribute(
            "aria-label",
            `${isPlaying ? "Pause" : "Play"} ${projectLabel}`
        );
        playButton.setAttribute("aria-pressed", String(isPlaying));
    }

    playButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (video.paused) {
            const playback = video.play();
            if (playback && playback.catch) {
                playback.catch(() => {});
            }
        } else {
            video.pause();
        }
    });

    video.addEventListener("loadedmetadata", setVideoAvailable);
    video.addEventListener("canplay", setVideoAvailable);
    video.addEventListener("error", setComingSoon);
    video.addEventListener("play", updateButton);
    video.addEventListener("pause", updateButton);
    video.addEventListener("ended", updateButton);

    video.hidden = false;
    playButton.hidden = false;
    comingSoon.hidden = true;
    updateButton();
    video.load();

});
}



/* =============================================================
   WORK PAGE VIDEO HOVER PREVIEW
   ============================================================= */

/*
    Desktop users can hover over a project video to get
    a subtle preview.

    We do NOT automatically play videos here because:

    1. It can be distracting.
    2. It can use unnecessary bandwidth.
    3. Mobile devices don't have true hover.
    4. The portfolio should feel intentional.

    So this section only handles hover state.
*/

portfolioProjects.forEach((project) => {

    const media =
        project.querySelector(".portfolio-media");

    if (!media) {
        return;
    }


    media.addEventListener("mouseenter", () => {

        project.classList.add("is-hovered");

    });


    media.addEventListener("mouseleave", () => {

        project.classList.remove("is-hovered");

    });

});



/* =============================================================
   WORK PAGE ANCHOR SCROLLING
   ============================================================= */

/*
    When someone visits:

        work.html#project-02

    the browser normally jumps immediately to the project.

    This gives the page a smoother transition while respecting
    the fixed navbar.
*/

if (
    window.location.pathname.endsWith("work.html") &&
    window.location.hash
) {

    window.addEventListener(
        "load",
        () => {

            const target =
                document.querySelector(
                    window.location.hash
                );


            if (!target) {
                return;
            }


            setTimeout(() => {

                const header =
                    document.querySelector(
                        ".site-header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight + 25
                        : 25;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;


                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            }, 100);

        }
    );

}



/* =============================================================
   WORK PAGE PROJECT REVEAL
   ============================================================= */

/*
    Project cards fade upward as they enter the viewport.

    IntersectionObserver is used instead of listening to every
    scroll event, which is more efficient.
*/

const workRevealElements =
    document.querySelectorAll(
            ".project-card"
    );


if (
    workRevealElements.length &&
    "IntersectionObserver" in window
) {

    const workRevealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "is-visible"
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12
            }
        );


    workRevealElements.forEach((project) => {

        workRevealObserver.observe(project);

    });

}



/* =============================================================
   WORK PAGE PROJECT VIDEO VISIBILITY
   ============================================================= */

/*
    If a project video is playing and the user scrolls it
    completely out of view, pause it.

    This avoids having videos continue playing while the user
    is looking at another part of the portfolio.
*/

if (
    portfolioProjects.length &&
    "IntersectionObserver" in window
) {

    const videoVisibilityObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    const video =
                        entry.target.querySelector(
                            ".project-video"
                        );


                    if (!video) {
                        return;
                    }


                    if (
                        !entry.isIntersecting &&
                        !video.paused
                    ) {

                        video.pause();

                    }

                });

            },
            {
                threshold: 0
            }
        );


    portfolioProjects.forEach((project) => {

        videoVisibilityObserver.observe(
            project
        );

    });

}



/* =============================================================
   WORK PAGE REDUCED MOTION
   ============================================================= */

/*
    Respect users who have enabled reduced motion
    in their operating system.
*/

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


if (prefersReducedMotion.matches) {

    workRevealElements.forEach((project) => {

        project.classList.add("is-visible");

    });

}
/* ============================================================
   ABOUT PAGE
   ============================================================ */

function initAboutPage() {

    const aboutPage =
        document.querySelector(".about-hero");

    /*
     * If this isn't the About page,
     * do nothing.
     */

    if (!aboutPage) {
        return;
    }


    const elements =
        document.querySelectorAll(
            [
                ".about-hero-content",
                ".about-hero-image",
                ".about-introduction",
                ".skill-card",
                ".experience-item",
                ".about-location",
                ".location-item",
                ".about-philosophy",
                ".about-cta"
            ].join(", ")
        );


    if (!elements.length) {
        return;
    }


    /*
     * Respect reduced-motion settings.
     */

    if (siteState.prefersReducedMotion) {

        elements.forEach((element) => {

            element.classList.add(
                "about-reveal-visible"
            );

        });

        return;
    }


    /*
     * Initial state.
     */

    elements.forEach((element) => {

        element.classList.add(
            "about-reveal"
        );

    });


    /*
     * Observe elements as they enter the viewport.
     */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "about-reveal-visible"
                        );


                        observerInstance.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    root: null,

                    rootMargin:
                        "0px 0px -50px 0px",

                    threshold: 0.1
                }
            );


        elements.forEach((element) => {

            observer.observe(element);

        });

    } else {

        /*
         * Fallback for browsers without
         * IntersectionObserver.
         */

        elements.forEach((element) => {

            element.classList.add(
                "about-reveal-visible"
            );

        });

    }

}
// =========================================================
// IZEL - CONTACT PAGE JAVASCRIPT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------------------------------
    // CONTACT FORM ELEMENTS
    // -----------------------------------------------------

    const contactForm = document.getElementById("contact-form");

    // If this page doesn't contain the contact form,
    // stop this section from doing anything.
    if (!contactForm) {
        return;
    }

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const projectTypeInput = document.getElementById("project-type");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const projectTypeError = document.getElementById("project-type-error");
    const messageError = document.getElementById("message-error");

    const characterCount = document.getElementById("character-count");

    const submitButton = document.getElementById("submit-button");
    const formStatus = document.getElementById("form-status");


    // -----------------------------------------------------
    // CHARACTER COUNTER
    // -----------------------------------------------------

    function updateCharacterCount() {

        if (!messageInput || !characterCount) {
            return;
        }

        const currentLength = messageInput.value.length;
        const maximumLength = messageInput.maxLength;

        characterCount.textContent =
            `${currentLength} / ${maximumLength}`;
    }

    messageInput.addEventListener("input", updateCharacterCount);

    // Set the initial count.
    updateCharacterCount();


    // -----------------------------------------------------
    // VALIDATION HELPERS
    // -----------------------------------------------------

    function clearError(input, errorElement) {

        input.classList.remove("error");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }


    function showError(input, errorElement, message) {

        input.classList.add("error");

        if (errorElement) {
            errorElement.textContent = message;
        }
    }


    function markValid(input) {

        input.classList.remove("error");
        input.classList.add("valid");
    }


    function clearValidation(input) {

        input.classList.remove("error");
        input.classList.remove("valid");
    }


    // -----------------------------------------------------
    // NAME VALIDATION
    // -----------------------------------------------------

    function validateName() {

        const name = nameInput.value.trim();

        clearValidation(nameInput);
        clearError(nameInput, nameError);

        if (name === "") {

            showError(
                nameInput,
                nameError,
                "Please enter your name."
            );

            return false;
        }

        if (name.length < 2) {

            showError(
                nameInput,
                nameError,
                "Your name must be at least 2 characters."
            );

            return false;
        }

        markValid(nameInput);

        return true;
    }


    // -----------------------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------------------

    function validateEmail() {

        const email = emailInput.value.trim();

        clearValidation(emailInput);
        clearError(emailInput, emailError);

        if (email === "") {

            showError(
                emailInput,
                emailError,
                "Please enter your email."
            );

            return false;
        }

        /*
         * This checks for a basic valid email format.
         * It isn't trying to become an international
         * email standards committee because nobody asked
         * for that kind of suffering.
         */
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );

            return false;
        }

        markValid(emailInput);

        return true;
    }


    // -----------------------------------------------------
    // PROJECT TYPE VALIDATION
    // -----------------------------------------------------

    function validateProjectType() {

        clearValidation(projectTypeInput);
        clearError(projectTypeInput, projectTypeError);

        if (projectTypeInput.value === "") {

            showError(
                projectTypeInput,
                projectTypeError,
                "Please select a project type."
            );

            return false;
        }

        markValid(projectTypeInput);

        return true;
    }


    // -----------------------------------------------------
    // MESSAGE VALIDATION
    // -----------------------------------------------------

    function validateMessage() {

        const message = messageInput.value.trim();

        clearValidation(messageInput);
        clearError(messageInput, messageError);

        if (message === "") {

            showError(
                messageInput,
                messageError,
                "Please tell me a little about your project."
            );

            return false;
        }

        if (message.length < 10) {

            showError(
                messageInput,
                messageError,
                "Please provide a little more detail."
            );

            return false;
        }

        if (message.length > 1500) {

            showError(
                messageInput,
                messageError,
                "Your message is too long."
            );

            return false;
        }

        markValid(messageInput);

        return true;
    }


    // -----------------------------------------------------
    // LIVE VALIDATION
    // -----------------------------------------------------

    nameInput.addEventListener("blur", validateName);

    emailInput.addEventListener("blur", validateEmail);

    projectTypeInput.addEventListener(
        "change",
        validateProjectType
    );

    messageInput.addEventListener(
        "blur",
        validateMessage
    );


    // -----------------------------------------------------
    // CLEAR ERRORS WHILE USER CORRECTS INPUT
    // -----------------------------------------------------

    nameInput.addEventListener("input", () => {

        if (nameInput.classList.contains("error")) {
            validateName();
        }

    });


    emailInput.addEventListener("input", () => {

        if (emailInput.classList.contains("error")) {
            validateEmail();
        }

    });


    messageInput.addEventListener("input", () => {

        if (messageInput.classList.contains("error")) {
            validateMessage();
        }

    });


    // -----------------------------------------------------
    // FORM SUBMISSION
    // -----------------------------------------------------

    contactForm.addEventListener("submit", async (event) => {

        /*
         * Prevent the browser from refreshing the page.
         * We'll handle the submission ourselves.
         */
        event.preventDefault();


        // Clear previous status message.
        formStatus.textContent = "";
        formStatus.className = "form-status";


        // Validate everything.
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isProjectTypeValid = validateProjectType();
        const isMessageValid = validateMessage();


        // Stop if anything is invalid.
        if (
            !isNameValid ||
            !isEmailValid ||
            !isProjectTypeValid ||
            !isMessageValid
        ) {

            formStatus.textContent =
                "Please fix the highlighted fields.";

            formStatus.classList.add("error");

            return;
        }


        // -------------------------------------------------
        // LOADING STATE
        // -------------------------------------------------

        submitButton.disabled = true;
        submitButton.classList.add("loading");


        /*
         * IMPORTANT:
         *
         * The form isn't connected to an email service yet.
         *
         * For now, this simulates the submission process so
         * we can test the UX.
         *
         * Later we'll connect this exact form to EmailJS or
         * Formspree.
         */
        try {

            await new Promise(resolve => {
                setTimeout(resolve, 1200);
            });


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            formStatus.textContent =
                "Message sent successfully. I'll get back to you soon.";

            formStatus.classList.add("success");


            // Reset the form.
            contactForm.reset();


            // Reset character counter.
            updateCharacterCount();


            // Remove validation styling.
            [
                nameInput,
                emailInput,
                projectTypeInput,
                messageInput
            ].forEach(input => {
                clearValidation(input);
            });


        } catch (error) {

            // ---------------------------------------------
            // ERROR
            // ---------------------------------------------

            console.error(
                "Contact form submission error:",
                error
            );

            formStatus.textContent =
                "Something went wrong. Please try again.";

            formStatus.classList.add("error");

        } finally {

            // ---------------------------------------------
            // RESTORE BUTTON
            // ---------------------------------------------

            submitButton.disabled = false;
            submitButton.classList.remove("loading");

        }

    });

});