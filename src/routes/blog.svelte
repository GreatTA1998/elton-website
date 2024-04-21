<div style="position: relative;">
  <h2 style="font-family: sans-serif; text-align: center;">
    Essay title
  </h2>

  <!-- Turns out the raintown aesthetics doesn't blend with lots of other visual images -->
  <!-- <video src="anime-rain-town.mp4" autoplay muted style="position: absolute; z-index: -1;"></video>
  <audio src="rainsound.mp3" controls></audio> -->

  <div style="display: flex; justify-content: center; margin-bottom: 24px;">
    <div style="width: 808px;">
      <ReusableBlock/>
    </div>
  </div>
  <LeftImageRightTextBlock/>

  <div style="display: flex; justify-content: center; margin-top: 24px; margin-bottom: 24px;">
    <div style="width: 808px;">
      <ReusableBlock/>
    </div>
  </div>

  <SideBySideImagesBlock/>

  <SingleCenteredImageBlock/>

  <MultiImageGalleryLayoutBlock/>
</div>

<script>
  import ReusableBlock from '$lib/ReusableBlock.svelte'
  import LeftImageRightTextBlock from '$lib/LeftImageRightTextBlock.svelte'
  import SideBySideImagesBlock from '$lib/SideBySideImagesBlock.svelte'
  import SingleCenteredImageBlock from '$lib/SingleCenteredImageBlock.svelte'
  import MultiImageGalleryLayoutBlock from '$lib/MultiImageGalleryLayoutBlock.svelte'

</script>