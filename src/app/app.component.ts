import { Component, ViewChild, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';


import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';


interface dataSource{
  name: string;
  date: string;
  review: string;
  rating: string;  
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatButtonModule, MatIconModule, MatToolbarModule, MatTableModule, MatPaginatorModule,
    FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  displayedColumns: string[] = ['name', 'date', 'review', 'rating']; // labels of table columns
  dataSource = [
    {
      name:'(name of the work)',
      date:'(your progress or when you start and finish the work)',
      review:'(your thoughts on the work)',
      rating:'(your rating of any scale)'
    }
  ]; // content of table

  // run at start
  ngOnInit() {
    // localStorage.clear(); // useful when i need to clean up
    if (localStorage.getItem('SaveData_source') !== null)
    {
      this.dataSource = JSON.parse(localStorage.getItem('SaveData_source')!);
      this.Clicked = JSON.parse(localStorage.getItem('SaveData_clicked')!);
    }
    console.log(localStorage.getItem('SaveData_source'));

    // how come the additional ! make it work is something i'm not sure i get https://stackoverflow.com/questions/11171746/reverse-of-json-stringify
  }

  newRow = {name:'(new)',date:'(new)',review:'(new)',rating:'(new)'};
  runningForm : boolean = false; // is the input field as you click on each cell running or not
  Clicked = [{name:false, date:false, review:false, rating:false}]; // is the cell clicked or not? only reset after clicking ok
  newClicked = {name:false, date:false, review:false, rating:false}; // redundant code maybe which i'm too tired to figure out how to improve
  RowDeletingMode : boolean = false;


  @ViewChild(MatTable) table!: MatTable<dataSource>; //or use ? in place of !

  Add() { // add a new row
    this.dataSource.push(Object.assign({}, this.newRow));
    this.Clicked.push(Object.assign({}, this.newClicked));
      
    this.table.renderRows();
  }

// on/off togglers
  onClick(Cell: 'name' | 'date' | 'review' | 'rating', index: number) 
  {
    //-------- These codes are used to delete rows
    // 
    if(this.RowDeletingMode)
    {
      this.dataSource.splice(index, 1);
      this.Clicked.splice(index, 1);
      localStorage.setItem('SaveData_source', JSON.stringify(this.dataSource));
      localStorage.setItem('SaveData_clicked', JSON.stringify(this.Clicked));  
      this.table.renderRows();
      return;
    }
    //
    //----------


    if(this.runningForm == true)
    return;

    this.Clicked[index][Cell] = !this.Clicked[index][Cell];
    this.runningForm = true;
  }

  click_OK(Event: MouseEvent, Cell: 'name' | 'date' | 'review' | 'rating', index: number) 
  {
    this.Clicked[index][Cell] = false;
    this.runningForm = false;

    localStorage.setItem('SaveData_source', JSON.stringify(this.dataSource));
    localStorage.setItem('SaveData_clicked', JSON.stringify(this.Clicked));  

    Event.stopPropagation(); // to stop the click on the ok being counted as a click on the cell
  } 

  RowDeletingMode_toggle()
  {
    if(this.runningForm == true)
    {
      return;
    }
    this.RowDeletingMode = !this.RowDeletingMode;
  }

  // plug in the paginator 

}
