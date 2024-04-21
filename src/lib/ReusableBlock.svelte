<!-- copied from zen journal -->
<textarea 
  value={''}
  on:input={handleInput}
  id={currentJournalEntryMMDD}
  class="reset-textarea" 
  name="hide" placeholder="Write anything..." 
  style="color: black; background-color: transparent; width: 100%; height: 90%; font-size: 16px; border: none;"
/>

<script>
  import _ from 'lodash'
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte'

  export let journal
  export let journalTitleFromMMDD
  export let willMusicAutoplay

  let currentJournalEntryMMDD = 'abcd1234'

  let isJournalPopupOpen = false
  let localTitle = ''
  let localValue = ''
  let cursorPos

  const dispatch = createEventDispatcher()

  const debouncedSaveJournalPage = _.debounce(saveJournalPage, 500)
  const debouncedSaveJournalEntryTitle = _.debounce(saveJournalEntryTitle, 500) 

  onMount(() => {
    createTodayJournal()
    localValue = journal[currentJournalEntryMMDD]

    if (journalTitleFromMMDD) {
      if (journalTitleFromMMDD[currentJournalEntryMMDD]) {
        localTitle = journalTitleFromMMDD[currentJournalEntryMMDD] 
      }
    }
  })

  // after each major debounced update on `journal`, we manually restore the cursor position to where it was
  $: restoreCursorPos (journal)  

  function restoreCursorPos (journal) {
    if (cursorPos) {
      const Elem = document.getElementById(currentJournalEntryMMDD)
      Elem.selectionEnd = cursorPos
    }
  }

  // checks if it exists already for today's date, if not it will initialize a new 
  // journal as empty string''
  function createTodayJournal () {
    if (!journal) { // backwards compatibility
      journal = {}
    }
    else {
      // don't create a blank journal if the journal already exists hence `return` 
      for (const journalDates of Object.keys(journal)) {
        if (journalDates === currentJournalEntryMMDD) {
          return
        }
      }
    }
    saveJournalPage()
  }

  function saveJournalEntryTitle () {
    dispatch('journal-entry-title-update', { entryMMDD: currentJournalEntryMMDD, newTitle: localTitle })
  }

  function saveJournalPage () {
    journal[currentJournalEntryMMDD] = localValue
    dispatch('journal-update', { newJournal: journal })
  }

  function handleTitleInput (e) {
    localTitle = e.target.value
    debouncedSaveJournalEntryTitle()
  }

  function handleInput (e) {
    const relevantInputElement = document.getElementById(currentJournalEntryMMDD)
    cursorPos = relevantInputElement.selectionStart
    localValue = e.target.value
    debouncedSaveJournalPage()
  }
</script>

<style>
  .reset-input {
    border: none;
    overflow: auto;
    outline: none;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;

    resize: none; /*remove the resize handle on the bottom right*/
  }

  ::-webkit-scrollbar {
    width: 0px;
  }
</style>