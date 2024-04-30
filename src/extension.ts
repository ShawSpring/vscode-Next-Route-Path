import * as vscode from 'vscode';
import type {Disposable} from 'vscode';
import {parsePath} from './parsePath';

export function activate({subscriptions}: vscode.ExtensionContext) {
  const routeStatus = RouteStatus.createOrShow();
  subscriptions.push(routeStatus); // push a object with dispose() method
  //todo: 快捷方式设置 baseUrl, 看 tooltip 能不能设置
  const disposables: Disposable[] = [
    vscode.commands.registerCommand('FileRoutePath.showPathname', () => {
      //? is it needed to active manully ?
      RouteStatus.createOrShow();
    }),
    vscode.commands.registerCommand('FileRoutePath.copyUrl', () => {
      const rs = RouteStatus.createOrShow();
      vscode.env.clipboard.writeText(rs.url);
    }),
  ];
  disposables.forEach((d) => subscriptions.push(d));
}

export function deactivate() {}

class RouteStatus {
  private _statusBarItem: vscode.StatusBarItem;
  private _listenerDisposables: Disposable[] = [];
  private static instance: RouteStatus;
  private _baseUrl = 'http://localhost:3000';
  private _pathname = '/';
  private constructor() {
    this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 500);
    this.updateBaseUrl();
    this.updateStatusBar(); //intial update

    this._statusBarItem.command = 'FileRoutePath.copyUrl';

    vscode.window.onDidChangeActiveTextEditor(
      this.updateStatusBar,
      this,
      this._listenerDisposables
    );
    vscode.workspace.onDidChangeConfiguration(
      () => {
        this.updateBaseUrl();
        this.updateStatusBar();
      },
      this,
      this._listenerDisposables
    );
  }

  public static createOrShow() {
    if (!RouteStatus.instance) {
      RouteStatus.instance = new RouteStatus();
    }
    return RouteStatus.instance;
  }
  // no need for now
  // public setBaseUrl(url: string) {
  //   // update WorkspaceConfiguration if specified otherwise global configuration
  //   vscode.workspace.getConfiguration().update('FileRoutePath.baseUrl', url);
  //   this._baseUrl = url;
  // }
  private updateBaseUrl() {
    this._baseUrl = vscode.workspace.getConfiguration().get('FileRoutePath.baseUrl') as string;
    console.log(this._baseUrl);
  }
  /**
   * get full url
   */
  public get url() {
    if (!this._baseUrl) {
      return this._pathname;
    }
    return new URL(this._pathname, this._baseUrl).href;
  }

  public updateStatusBar() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      this._pathname = this.generatePathname(editor);
      this._statusBarItem.text = this._pathname;
      const markdown = new vscode.MarkdownString(
        `$(ports-open-browser-icon) [${this.url}](${this.url})`,
        true
      );
      this._statusBarItem.tooltip = markdown;
      this._statusBarItem.show();
    } else {
      this._statusBarItem.hide();
    }
  }
  private generatePathname(editor: vscode.TextEditor) {
    const workSpaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (!workSpaceFolder) {
      this._statusBarItem.hide();
      return '';
    }
    const relativePath = vscode.workspace.asRelativePath(editor.document.uri);

    return parsePath(relativePath);
  }
  public dispose() {
    this._statusBarItem.dispose();
    this._listenerDisposables.forEach((d) => d.dispose());
  }
}
