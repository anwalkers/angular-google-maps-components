import { Injectable, NgZone } from "@angular/core";

import { Observable, of, Subscriber } from "rxjs";

export type MapEventManagerTarget =
  | {
      addListener: (
        name: string,
        callback: (...args: any[]) => void
      ) => google.maps.MapsEventListener;
    }
  | undefined;

export class MapEventManagerService {
  private _target: MapEventManagerTarget;
  private _listeners: google.maps.MapsEventListener[] = [];
  /** Pending listeners that were added before the target was set. */
  private _pending: {
    observable: Observable<any>;
    observer: Subscriber<any>;
  }[] = [];

  constructor(protected _ngZone: NgZone) {}

  public setEventListenerTarget(target: MapEventManagerTarget) {
    if (target === this._target) {
      return;
    }

    // Clear the listeners from the pre-existing target.
    if (this._target) {
      this._clearListeners();
      this._pending = [];
    }

    this._target = target;

    // Add the listeners that were bound before the map was initialized.
    this._pending.forEach(subscriber =>
      subscriber.observable.subscribe(subscriber.observer)
    );
    this._pending = [];
  }

  public getTargetEvent<T>(event: string): Observable<T> {
    const observable = new Observable<T>(observer => {
      // If the target hasn't been initialized yet, cache the observer so it can be added later.
      if (!this._target) {
        this._pending.push({observable, observer});
        return undefined;
      }

      const listener = this._target.addListener(event, (event: T) => {
        this._ngZone.run(() => observer.next(event));
      });
      this._listeners.push(listener);
      return () => listener.remove();
    });

    return observable;
  }

  /** Clears all currently-registered event listeners. */
  private _clearListeners() {
    for (let listener of this._listeners) {
      listener.remove();
    }

    this._listeners = [];
  }

  public destroy() {
    this._clearListeners();
    this._target = undefined;
  }
}
