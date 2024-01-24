import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export function useAnimationTransition() {
  const location = useLocation();

  useEffect(() => {
    // console.log(location.pathname);
  }, [location.pathname]);

  return;
}

class PageState {
  private _currentURL: string;
  private _previousURL: string;
  private _isBusy: boolean;
  private _inSession: boolean;

  constructor(url: string) {
    this._currentURL = url;
    this._previousURL = "";

    this._isBusy = false;
    this._inSession = false;
  }

  get currentURL() {
    return this._currentURL;
  }

  get previousURL() {
    return this._previousURL;
  }

  get isBusy() {
    return this._isBusy;
  }

  get inSession() {
    return this._inSession;
  }

  set setCurrentURL(url: string) {
    this._currentURL = url;
  }

  set serPreviousURL(url: string) {
    this._previousURL = url;
  }

  set setIsBusy(bool: boolean) {
    this._isBusy = bool;
  }

  set setInSession(bool: boolean) {
    this._inSession = bool;
  }

  // check if anything is showing
  // if showing -> exit animation UNTIL nothing is showing
  // if not show -> enter animation
  // update url history

  showPage() {}

  hidePage() {}

  checkPageState() {}

  updatePage() {}
}
