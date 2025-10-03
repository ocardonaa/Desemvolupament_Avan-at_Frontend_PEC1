import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, catchError, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  posts$: Observable<PostDTO[]>;
  //userName$: Observable<string>;
  //private userIdSubject = new BehaviorSubject<string>('');
  //userId$: Observable<string> = this.userIdSubject.asObservable();
  showButtons: boolean;
  constructor(
    private postService: PostService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private router: Router,
    private headerMenusService: HeaderMenusService
  ) {
    this.showButtons = false;
    this.posts$ = of([]);
    //this.userName$ = of('');
  }

  ngOnInit(): void {
    //const storedUser = this.localStorageService.get('user_id') || '';
    //this.userIdSubject.next(storedUser);  
    //this.setupUserNameStream();
    this.loadPosts();
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        if (headerInfo) {
          this.showButtons = headerInfo.showAuthSection;
        }
      }
    );
  }

  /*
  getUserName(userId: string): Observable<string> {
    if(!userId) return of('');
    const userData$ = from(this.userService.getUSerById(userId));
    return userData$.pipe(
      map(user => user.name),
      catchError(() => of('Unknown user')))
  }

  private setupUserNameStream() {
    this.userName$ = this.userId$.pipe(
      distinctUntilChanged(),
      switchMap(id => this.getUserName(id)),
      startWith('')
    );
  }
    */

  private async loadPosts(): Promise<void> {
    // TODO 2
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.showButtons = true;
    }
    try {
      this.posts$ = from(this.postService.getPosts());
      console.log(this.posts$);
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  //paso 1: todos los posts
  //paso 2: por cada post de this.posts, hacer un getUserById y guardar los nombres en un array
  //paso 3: con un ngFor patearme ese array
  /*
  private async getUserName(user_id: string): Promise<string> {
    const userData = await this.userService.getUSerById(user_id);
    console.log(userData.name)
    return userData.name;
  }
    */

  async like(postId: string): Promise<void> {
    let errorResponse: any;
    try {
      await this.postService.likePost(postId);
      this.loadPosts();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  async dislike(postId: string): Promise<void> {
    let errorResponse: any;
    try {
      await this.postService.dislikePost(postId);
      this.loadPosts();
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }
}
