export interface MediaFileModel {
  url: string;
  type: "male" | "female";
  file?: File;
}

export type ScheduleModel = {
  id: string;
  name: string;
  interval: number;
  duration: number;
  code: string;
  loop: boolean;
  country_name: string;
  country_id: number;
  state_name: string;
  state_id: number;
  city_name: string;
  city_id: number;
  type_schedule_id: string;
  client_id: string;
  media_urls: MediaFileModel[];
};

export type TypeScheduleModel = {
  id: string;
  name: string;
};

export type ScheduleFormPostModel = {
  name: string;
  interval: number;
  duration: number;
  code: string;
  loop: boolean;
  country_name: string;
  country_id: number;
  state_name: string;
  state_id: number;
  city: string;
  city_id: number;
  type_schedule_id: string;
  client_id: string;
  media_urls: MediaFileModel[];
};

export type ScheduleResponseModel = {
  schedules: ScheduleModel[];
  nextToken?: string;
};

export type TypeScheduleResponseModel = {
  typeSchedules: TypeScheduleModel[];
  nextToken?: string;
};

export type TypeScheduleParamsModel = {
  name?: string;
  limit?: number;
  nextToken?: string;
};

export type ScheduleParamsModel = {
  name?: string;
  limit?: number;
  nextToken?: string;
  type_schedule_id: string;
  country_id: number;
  state_id: number;
  client_id?: string;
};

export type ScheduleAudioModel = {
  url: string;
  name: string;
  type: "male" | "female";
};

/*
Contexto: Hola tengo una app desktop con react y electron, esto es un proyecto para poder que los dueños o administradores de las panaderias puedan  descargar las programaciones y reproducirlas.

Programaciones: Las programaciones son un array de item en la base de datos que ya tengo en la base de datos y aqui te paso el tipado de como esta cada item

export interface MediaFileModel {
  url: string;
  type: "male" | "female";
  file?: File;
}

export type ScheduleModel = {
  id: string;
  name: string;
  interval: number;
  duration: number;
  code: string;
  loop: boolean;
  country_name: string;
  country_id: number;
  state_name: string;
  state_id: number;
  city_name: string;
  city_id: number;
  type_schedule_id: string;
  client_id: string;
  media_urls: MediaFileModel[];
};


idea de negocio y funcionalidad core:
La idea de la funcionalidad es que el usuario entra a la app la app hace una peticion al backend para obtener esas programaciones, cuando obteniene las programaciones le muestra una lista al usuario, ahora bien, la programacion tiene multiples audios ejemplo voz1, voz2 las cuales son para tener diferentes opciones pero dicen lo mismo, una puede ser hombre y otra mujer, ahora bien el usuario vera cada item como una card y ahi en cada card vera los audios para darle play, esto significa que cuando el usuario le de en alguno de esos audios dentro de la card para activar la programacion el sistema analiza si ya habia una programacion sonando, si no hay el sistema activa el audio y se basa en el intervalo y duracion, el intervalo es cada cuando deberia volver a sonar y esto es en minutos, y la duracion es la cantidad de veces que debe de sonar, ejemplo interval: 1, duration: 8, sonara cada minuto y por 8 veces despues de que termine de sonar las 8 veces deberia quitar esa programacion de la cola, ahora bien si el usuario le da click a una programacion y ya hay una sonando, debe de crear el sistema de colas para que siempre suene la primera que esta en la cola si ya es su turno de sonar, esto permite que el usuario pueda activar las que quiera y simplemente esperen el momento para sonar, o sea si un audio de una prorgamacion termino de sonar por que era su turno el sistema revisar si hay otro en cola listo para sonar. Algo importante es que este core de negocio yo ya lo habia hecho pero lo que hacia era que cada segundo verificaba el estado de los audios por sonar y asi lo que hacia era convertir los intervalos en segundos ejemplo interval: 1 = time_to_reproduce=60 * 1(intervalo) segundos o sea que cada segundo que el sistema verificaba le iba descontando un segundo a esos que estaban activos y asi cuando llegaba a 0 era que ya le tocaba sonar y lo ponia en la lista de espera para sonar, o sea que siempre tenia varias listas, una donde estaba los audios, otra donde estan los audios que se les iba descontando cada segundo y luego otra de los que ya estaban en 0 segundos o sea listo para sonar pero ya habia otro sonando, de esta manera logre que nunca se troquen audios y siempre si o si respeten la fila para poder sonar e ir descontando el tiempo y duracion.

Ahora bien, me gustaria saber si esto es un buen aproach y que me digas como hacerlo con la informacion que te di o si tienes una mejor opcion que no sea validar cada segundo ya que cada segundo estaria consumiendo recursos. si me dices que esta bien me podrias dar el ejemplo por favor completo, asume que el api ya te responde y solo enfocate en esa logica cuando se le da click a sonar, algo tambien a tener en cuenta es que si una programacion esta activa deberia verse en otra tab y si el usuario le da apagar deberia quitarla automaticamente de todo lado para que no vaya a sonar, obvio si esta sonando terminar de que suene y eliminarla de todo lado. y siempre recuerda que esto es una app desktop con electron y react js.
*/
