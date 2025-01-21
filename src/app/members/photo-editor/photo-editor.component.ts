import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { MembersService } from '../../_services/members.service';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [ NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe ],
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);
  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<Member>();

  memberService = inject(MembersService);

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/add-photo",
      authToken: "Bearer " + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = {...this.member()}
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);

      //para a atualização das fotos quando for adicionado pela primerira vez e ao setala como main ela carregar na foto de perfil
      if(photo.isMain){
        this.onSetUserPhotoUrl(photo);
        this.onChangeMainPhoto(updatedMember, photo);
      }
    }
  }

  onSetMainPhoto(photo: Photo) {
    this.memberService.onSetMainPhoto(photo).subscribe({
      next: _ => {
        this.onSetUserPhotoUrl(photo);

        const updatedMember = {...this.member()};
        this.onChangeMainPhoto(updatedMember, photo);
      }
    });
  }

  onDeletePhoto(photo: Photo) {
    this.memberService.onDeletePhoto(photo).subscribe({
      next: _ => {
        const updatedMember = {...this.member()}
        updatedMember.photos = updatedMember.photos.filter(x => x.id !== photo.id);
        this.memberChange.emit(updatedMember);
      }
    })
  }

  private onSetUserPhotoUrl(photo: Photo) {
    const user = this.accountService.currentUser();
    if(user){
      user.photoUrl = photo.url;
      this.accountService.onSetCurrentUser(user);
    }
  }

  private onChangeMainPhoto(updatedMember: Member, photo: Photo) {
    updatedMember.photoUrl = photo.url;
    updatedMember.photos.forEach(p =>{
      if(p.isMain) p.isMain = false;
      if(p.id == photo.id) p.isMain = true;
    })
    this.memberChange.emit(updatedMember);
  }
}
