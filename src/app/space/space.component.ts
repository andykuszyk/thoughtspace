import { Component, OnInit } from '@angular/core';
import { Thought } from '../thought/thought';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css']
})
export class SpaceComponent implements OnInit {
    thoughts: Thought[];
    previousThoughts: Thought[];
    currentThought: Thought;

    constructor() { }

    ngOnInit() {
        this.currentThought = new Thought("Root", 0, 0, 0);
        this.currentThought.thoughts = [
            new Thought("small", 0.2, 10, 10),
            new Thought("medium", 1, 400, 200),
            new Thought("large", 2, 100, 300),
        ];
        this.thoughts = this.currentThought.thoughts;
        this.previousThoughts = [];
    }

    onMouseDown(event: any) {
        if(event.target.id == "back") {
            this.goBack();
            return;
        }
        
        let thoughtsToRemove = [];
        for(let thought of this.thoughts) {
            if(thought.isSelected && event.target.id == "remove-thought") {
                thoughtsToRemove.push(thought); 
            }
            if(thought.isSelected && event.target.id == "open-thought") {
                this.thoughts = thought.thoughts;
                this.previousThoughts.push(this.currentThought);
                this.currentThought = thought;
            }
            if(thought.isOver(event.pageX, event.pageY)) {
                thought.isSelected = true;
                thought.isDragging = true;

            } else {
                thought.isSelected = false;
                thought.isEditing = false;
            }
        }

        for(let thought of thoughtsToRemove) {
            this.thoughts.splice(this.thoughts.indexOf(thought, 0), 1);
        }
    }

    goBack() {
        if(this.previousThoughts.length == 0) return;
        this.currentThought = this.previousThoughts.pop();
        this.thoughts = this.currentThought.thoughts;
    }

    onMouseDoubleClick(event: any) {
        for(let t of this.thoughts) {
            if(t.isOver(event.pageX, event.pageY)) return;
        }

        let thought = new Thought("untitled", 1, event.pageX, event.pageY);
        thought.isSelected = true;
        thought.isEditing = true;
        this.thoughts.push(thought);
    }
        
    onMouseUp(event: any) {
        for(let thought of this.thoughts) {
            thought.isDragging = false;
        }
    }

    onMouseMove(event: any) {
        for(let thought of this.thoughts) {
            if(!thought.isDragging) continue;
            thought.onMouseMove(event);
        }
    }
}
