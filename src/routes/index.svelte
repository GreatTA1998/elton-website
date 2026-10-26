<p>
  Welcome to my absolutely EPIC website, it's INSANE:
</p>

<div class="app-cards">
  <a class="app-card" target="_blank" rel="noopener noreferrer" href="https://actions.life">
    <img class="app-card-logo" src="/actions-life-logo.png" alt="actions.life logo" />
    <div class="app-card-text">
      <strong>actions.life</strong>
      <span>Put to-do lists on the calendar.</span>
    </div>
  </a>
  <a class="app-card" target="_blank" rel="noopener noreferrer" href="https://explanations.io">
    <img class="app-card-logo" src="/explanations-logo.png" alt="explanations.io logo" />
    <div class="app-card-text">
      <strong>explanations.io</strong>
      <span>Blackboard-video explanations.</span>
    </div>
  </a>
  <a class="app-card" target="_blank" rel="noopener noreferrer" href="https://zetteldraw.com">
    <img class="app-card-logo" src="/zetteldraw-logo.png" alt="zetteldraw logo" />
    <div class="app-card-text">
      <strong>zetteldraw</strong>
      <span>Handwriting-first notes on a Boox.</span>
    </div>
  </a>
  <a class="app-card" target="_blank" rel="noopener noreferrer" href="https://zen-message.com">
    <img class="app-card-logo" src="/zen-message-logo.jpg" alt="zen-message logo" />
    <div class="app-card-text">
      <strong>zen-message</strong>
      <span>A calmer, less interruptive messaging system.</span>
    </div>
  </a>
</div>

<div class="essay-grid">
  <div class="essay-left">
    <a
      class="essay-thumb-link"
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.youtube.com/watch?v=DhyhHdN02xc"
    >
      <img
        class="essay-thumb"
        src="/notion-essay-thumb.jpg"
        alt="Beyond the features: what is the point of Notion?"
      />
    </a>
    <p class="essay-title">
      <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=DhyhHdN02xc">
        Beyond the features: what is the point of Notion?
      </a>
    </p>
    <p class="essay-sentence">
      Notion's two innovations: navigating your own content freely, and organizing it beyond folders and notes.
    </p>
  </div>
  <div class="empty-frame empty-frame-top" aria-hidden="true"></div>
  <div class="empty-frame empty-frame-bottom" aria-hidden="true"></div>
</div>

<div style="display: flex; flex-wrap: wrap;">

<div>
  <img src="david-goggins.png" alt="David Goggins running" width="400" height="300"/>
  <div style="display: flex; align-items: center">
    <audio controls src="chopin-etude-1.mp3" type="audio/mp3" style="width: 400px;"></audio>
  </div>
</div>

<div>
  <img src="https://cdns-images.dzcdn.net/images/cover/d23308fd612026c39ba4ea5f3f99ab83/500x500.jpg" width="400" alt="Ghost in a Flower album cover"/>
  <div>
    <audio controls="true" src="ghost-in-a-flower.mp3" type="audio/mp3" style="width: 400px;"></audio>
  </div>
</div>

<div>
  <a href="https://www.youtube.com/watch?v=Aa8bXkRsP0A&list=OLAK5uy_lgovKkb1IAMZFrPWYa8_Dh71Kimw5RbjA&index=8" aria-label="All of Me on YouTube">
    <img src="https://m.media-amazon.com/images/I/61b0Mz2-fDL._SY580_.jpg" width="400" alt="All of Me album cover"/>
  </a>
  <div>
    <audio controls="true" src="all-of-me.mp3" type="audio/mp3" style="width: 400px;"></audio>
  </div>
</div>

<div class="bach-cover">
  Bach Prelude &amp; Fugue in D
</div>

</div>

<main>
</main>

<script>
</script>

<style>
  .app-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 12px 0 28px;
  }

  .app-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border: 1px solid #d0d0d0;
    text-decoration: none;
    color: inherit;
    box-sizing: border-box;
  }

  .app-card-logo {
    width: 56px;
    height: 56px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .app-card-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .app-card-text strong {
    font-weight: 700;
  }

  .app-card-text span {
    font-size: 0.95em;
  }

  .essay-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin: 0 0 28px;
    align-items: start;
  }

  .essay-left {
    min-width: 0;
  }

  .essay-thumb-link {
    display: block;
  }

  .essay-thumb {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .essay-title {
    margin: 10px 0 4px;
  }

  .essay-title a {
    color: inherit;
  }

  .essay-sentence {
    margin: 0;
  }

  .empty-frame {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #e8e8e8;
  }

  .empty-frame-top {
    align-self: start;
  }

  .empty-frame-bottom {
    grid-column: 1;
  }

  .bach-cover {
    width: 400px;
    height: 400px;
    box-sizing: border-box;
    border: 1px solid #d0d0d0;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 16px;
  }

  @media (max-width: 900px) {
    .app-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 700px) {
    .app-cards {
      grid-template-columns: 1fr;
    }

    .essay-grid {
      grid-template-columns: 1fr;
    }

    .empty-frame-bottom {
      grid-column: 1;
    }
  }
</style>
