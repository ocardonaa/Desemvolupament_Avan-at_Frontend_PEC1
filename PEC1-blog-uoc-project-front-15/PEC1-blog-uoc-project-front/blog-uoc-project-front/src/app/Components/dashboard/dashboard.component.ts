import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  posts!: PostDTO[];
  total_likes: number;
  total_dislikes: number;
    constructor(
      private postService: PostService,
      private sharedService: SharedService,
      private router: Router,
    ) {
      this.total_dislikes = this.total_likes = 0;
    }
  
    ngOnInit(): void {
      this.loadPosts();
    }

    private calculateLikesDislikes(): void {
      this.posts.forEach(post => {
        this.total_likes += post.num_likes;
        this.total_dislikes += post.num_dislikes;
      });
    }
  
    private async loadPosts(): Promise<void> {
      let errorResponse: any;
      try {
        this.posts = await this.postService.getPosts();
        this.calculateLikesDislikes();
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
}
