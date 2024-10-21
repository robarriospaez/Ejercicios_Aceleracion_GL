interface Task<T> {
  id: number;
  type: string;
  data: T;
}

interface EmailTask {
  recipient: string;
  subject: string;
  body: string;
}

interface NotificationTask {
  userId: number;
  message: string;
}

interface ReportTask {
  reportType: string;
  startDate: Date;
  endDate: Date;
}

//cola de tareas genérica
class TaskQueue<T> {
  private tasks: Task<T>[] = [];
  private nextId: number = 1;

  //agregar una tarea a la cola
  addTask(type: string, data: T): number {
    const task: Task<T> = {
      id: this.nextId++,
      type,
      data,
    };
    this.tasks.push(task);
    return task.id;
  }

  // cancelar una tarea por su ID
  cancelTask(id: number): boolean {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  //procesar todas las tareas en la cola
  processTasks(processor: (task: Task<T>) => void): void {
    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) {
        processor(task);
      }
    }
  }

  // btener el número de tareas en la cola
  get taskCount(): number {
    return this.tasks.length;
  }
}

//uso ej:
const emailQueue = new TaskQueue<EmailTask>();
const notificationQueue = new TaskQueue<NotificationTask>();
const reportQueue = new TaskQueue<ReportTask>();

// Agregar tareas a las colas
const emailTaskId = emailQueue.addTask("email", {
  recipient: "rocio@gmail.com",
  subject: "Que calor",
  body: "Hola, ¿cómo estás?",
});

notificationQueue.addTask("notification", {
  userId: 456,
  message: "Te ha llegado un correo",
});

reportQueue.addTask("report", {
  reportType: "monthly",
  startDate: new Date(2024, 6, 1),
  endDate: new Date(2025, 6, 31),
});

// Cancelar una tarea
emailQueue.cancelTask(emailTaskId);

// Verificar el número de tareas restantes
console.log(`Remaining email tasks: ${emailQueue.taskCount}`);
console.log(`Remaining notification tasks: ${notificationQueue.taskCount}`);
console.log(`Remaining report tasks: ${reportQueue.taskCount}`);
