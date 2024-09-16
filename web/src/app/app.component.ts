import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  template: `<div class="flex flex-col gap-6">
    <div class="flex flex-col w-full gap-2">
      <input type="text" placeholder="Type here" class="input w-full" />
      <button class="btn">
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
          <span>Error! Task failed successfully.</span>
        </div>
      }
    </div>
    @if ($links(); as items) {
      <ul class="text-start flex flex-col gap-2">
        @for (item of items; track item) {
          <li class="flex gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              />
            </svg>

            <a class="link">{{ item }}</a>
          </li>
        } @empty {
          <li>There are no links.</li>
        }
      </ul>
    } @else {
      <span>Enter a URL to get RSS links.</span>
    }
  </div> `,
  selector: 'app-root',
  styles: `
    :host {
      padding: 2rem;
      text-align: center;
    }
  `,
  standalone: true,
})
export class AppComponent {
  private readonly httpClient = inject(HttpClient);

  protected readonly $links = signal<string[] | undefined>(undefined);
  protected readonly $error = signal<boolean>(false);
  protected readonly $loading = signal<boolean>(false);

  onSubmtit(): void {}
}
