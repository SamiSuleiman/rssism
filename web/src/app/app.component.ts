import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { NgClass } from '@angular/common';

@Component({
  template: `<div class="flex flex-col gap-6">
    <div class="flex flex-col w-full gap-2">
      <input
        type="text"
        placeholder="Type here"
        class="input w-full"
        [formControl]="urlCtrl"
      />
      <button
        class="btn"
        (click)="onSubmtit()"
        [disabled]="!urlCtrl.value || $loading()"
      >
        @if ($loading()) {
          <span class="loading loading-bars loading-xs"></span>
        } @else {
          Submit
        }
      </button>
      @if ($error()) {
        <div role="alert" class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span> Error! Enter a valid URL.</span>
        </div>
      }
    </div>
    @if ($links(); as items) {
      <ul class="text-start flex flex-col gap-2">
        @for (item of items; track item) {
          <li class="flex gap-4">
            <a class="link" [href]="item"> - {{ item }}</a>
          </li>
        } @empty {
          <li>There are no links.</li>
        }
      </ul>
    } @else {
      <span>Enter a URL to get RSS links.</span>
    }
  </div> `,
  styles: `
    :host {
      padding: 2rem;
      text-align: center;
    }
  `,
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-root',
  standalone: true,
})
export class AppComponent {
  private readonly httpClient = inject(HttpClient);

  private readonly destroyRef = inject(DestroyRef);

  protected readonly $links = signal<string[] | undefined>(undefined);
  protected readonly $error = signal<boolean>(false);
  protected readonly $loading = signal<boolean>(false);

  readonly urlCtrl = new FormControl('');

  onSubmtit(): void {
    this.$loading.set(true);
    this.$error.set(false);
    this.$links.set(undefined);

    this.httpClient
      .get<{
        url: string;
      }>(`${environment.serverUrl}?url=${this.urlCtrl.value}`)
      .pipe(
        catchError(() => {
          this.$error.set(true);
          this.$loading.set(false);
          return [];
        }),
        tap((res) => {
          if (!res.url) this.$links.set([]);
          else this.$links.set([res.url]);
          this.$loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({});
  }

  onCopyToClipboard(link: string): void {
    navigator.clipboard.writeText(link);
  }
}
