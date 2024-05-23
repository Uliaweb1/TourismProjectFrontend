import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retryWhen, delay, take, mergeMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';
  private isLoggedIn: boolean = false;
  private username: string = '';
  private sessionId: string = '';

  private weather_api_key: String = 'be95c178c9346d0dc7c1be10e9a6b3a0';
  private lat: String = '50.450001'; // Latitude for Kyiv
  private lon: String = '30.523333'; // Longitude for Kyiv
  private city: String = 'Kiyv'; // Longitude for Kyiv
  private city_id: String = '687021'; // Location in Kyiv
  private lang: String = 'ua';
  // private part: String = 'current,minutely,hourly,daily,alerts'; // do not include alerts for weather info
  private part: String = 'minutely,hourly,daily,alerts'; // do not include alerts for weather info

  private weather_info: any;

  // constructor(private http: HttpClient) {
  constructor(private http: HttpClient, private cookies: CookieService) {
    // const username = localStorage.getItem('username');
    const username = this.cookies.get('username');
    if (username) {
      this.username = username,
      this.isLoggedIn = true;
      console.log('User is already logged in as:', username);
    }
  }

  sendPostRequest(data: any, endpoint: String): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data);
  }

  sendGetRequest(endpoint: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  sendDeleteRequest(endpoint: String, item: String): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}/${item}`);
  }

  login(username: string, password: string): Observable<boolean> {
    this.sessionId = 'some-session-id'; // Simulated session ID
    if (username.trim() !== '' && password !== '') {
      this.sendPostRequest({
        action: 'login',
        user: username,
        password: password
      }, 'users')
      .subscribe(
        (response: any) => {
          if(response.login === 'success') {
            this.username = username,
            this.isLoggedIn = true;
            // localStorage.setItem('username', this.username);
            this.cookies.set('username', this.username);
          }
          console.log('POST Response:', response);
        },
        (error: any) => {
          console.error('Error sending POST request:', error);
        }
      );
      return of(true);
    }
    return of(false);
  }

  register(username: string, email: string, password: string): Observable<boolean> {
    this.sessionId = 'some-session-id'; // Simulated session ID
    if (username.trim() !== '' && password !== '') {
      this.sendPostRequest({
        action: 'register',
        user: username,
        email: email,
        password: password
      }, 'users')
      .subscribe(
        (response: any) => {
          if(response.register === 'success') {
            this.username = username,
            this.isLoggedIn = true;
            // localStorage.setItem('username', this.username);
            this.cookies.set('username', this.username);
          }
          console.log('POST Response:', response);
        },
        (error: any) => {
          console.error('Error sending POST request:', error);
        }
      );
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    // Simulate logout
    this.isLoggedIn = false;
    this.username = '';
    this.sessionId = '';
    // localStorage.removeItem('username');
    this.cookies.deleteAll();
  }

  isLoggedInUser(): boolean {
    return this.isLoggedIn;
  }

  getUsername(): string {
    return this.username;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getComments(): Observable<any> {
    return this.sendGetRequest('messages').pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(1000), // delay 1000ms
          mergeMap((error, attemptCount) => {
            if (attemptCount < 10) { // Limit retries to a reasonable number
              return throwError(error);
            } else {
              throw 'Retry limit exceeded';
            }
          })
        )
      ),
      catchError(error => {
        throw 'Error getting coments';
      })
    );
  }

  addComment(user: string, body: string): Observable<any> {
    return this.sendPostRequest({ user_id: user, message: body }, 'messages');
  }

  deleteComment(comment_id: string): Observable<any> {
    return this.sendDeleteRequest('messages', comment_id);
  }

  fetchWeather(): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/forecast?id=${this.city_id}&appid=${this.weather_api_key}&lang=${this.lang}`);
  }

  updateWeatherInfo() {
    this.fetchWeather().subscribe((data: any) => {
      this.weather_info = data;
      console.info('fetchWeather succeded:', data);
    }, error => {
      console.error('Error fetching data:', error);
    });
  }

  getWeatherInfo() {
    return this.weather_info;
  }
}
